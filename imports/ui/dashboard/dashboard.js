import { Template } from 'meteor/templating';

import { Requests } from '../../api/requests.js';

import './dashboard.html';
import '../request/request.html';
import '../request/last_requests.html';
import '../request/show_request.html';
import '../occurrence/occurrence.html';

Template.dashboard.helpers({
    // E-mail do usuário
    userEmail() {
        return Meteor.user().emails[0].address;
    },
    // Exibe a tela das últimas 10 requisições
    lastRequests() {
        return Session.get('lastRequests');
    },
    // Exibe a tela de "nova requisição"
    newRequest() {
        return Session.get('newRequest');
    },
    // Exibe uma requisição, com todas suas ocorrências
    showRequest() {
        return Session.get('showRequest');
    },
    //Exibe tela de nova ocorrência
    newOccurrence() {
        return Session.get('newOccurrence');
    },
    //Requisições no mês
    requestsMonth() {
        return Requests.find({createdBy: Meteor.user().emails[0].address}).count();
    },
    requestsUnsuccessful() {
        return Requests.find({status: 'Finalizado sem sucesso', createdBy: Meteor.user().emails[0].address}).count();
    },
    requestsSuccessful() {
        return Requests.find({status: 'Finalizado com sucesso', createdBy: Meteor.user().emails[0].address}).count();
    },
    requestsOnhold() {
        return Requests.find({status: 'Aguardando aprovação', createdBy: Meteor.user().emails[0].address}).count();
    },
    requestsProcessing() {
        return Requests.find({status: 'Processando', createdBy: Meteor.user().emails[0].address}).count();
    },
    requestStatus(status) {

    	var labelClass = '';

        switch (status) {
            case 'Processando':
                labelClass = 'info';
                break;

            case 'Aguardando aprovação':
                labelClass = 'warning';
                break;

            case 'Finalizado com sucesso':
                labelClass = 'success';
                break;

            case 'Finalizado sem sucesso':
                labelClass = 'danger';
                break;

            default:
                labelClass = 'primary';
                break;
        }
        
        return '<span class="label label-' + labelClass + '">' + status + '</span>';
    }
});

Template.last_requests.helpers({
    requests() {
        // return Requests.find({createdBy: Meteor.user().emails[0].address}, { sort: { createdAt: -1 } });
        return Requests.find({}, { sort: { createdAt: -1 } });
    }
});

Template.show_request.helpers({
    requestName() {
        return Session.get('req').name;
    },
    requestCreatedBy() {
    	return Session.get('req').createdBy;
    }
});

Template.occurrence.helpers({
    requestName() {
        return Session.get('req').name;
    },
    previousStatus() {
    	return Session.get('req').status;
    },
    userEmail() {
        return Meteor.user().emails[0].address;
    }
});

Template.show_request.helpers({
    requestOccurrences() {
        var requests = Requests.find({ _id: Session.get('req')._id}, {sort: {"occurrences.createdAt": -1}});

        return requests;
    },
    hasOccurrences() {
        return Requests.find({ _id: Session.get('req')._id });
    }
});


Template.dashboard.rendered = function() {
    Session.set('lastRequests', true);
};

//Para zerar as variáveis de sessão
Session.unset = function() {
    _.each(Session.keys, function(value, key) {
        // Só pra manter a última requisição em evidência
        if (key != 'req') {
            Session.set(key, false);
        }
    });
};

Template.dashboard.events({
    'click .logout-btn': function(e) {
        e.preventDefault();
        Session.keys = {};
        Meteor.logout();
    },
    'click .new-request': function(e) {
        e.preventDefault();

        Session.unset();
        Session.set('newRequest', true);
    },
    'click .cancel-request': function(e) {
        e.preventDefault();

        Session.unset();
        Session.set('lastRequests', true);
    },
    'click .new-occurrence': function(e) {
        e.preventDefault();

        Session.unset();
        Session.set('newOccurrence', true);
    },
    
    'click #new-request-form .start': function(e) {
        e.preventDefault();

        Uploader.finished = function(index, fileInfo, templateContext) {

			Requests.insert({
	            name: $('#new-request-form #name').val(),
	            status: 'Processando',
	            file: fileInfo,
	            createdBy: Meteor.user().emails[0].address,
	            createdAt: new Date()
	        }, function(err, result) {
	            if (err) {
	                FlashMessages.sendError(err.error);
	            } else {

	                Session.unset();
	                Session.set('lastRequests', true);

	                FlashMessages.sendSuccess("Requisição criada com sucesso!");
	            }
	        });    
		}
    },

    'submit #new-occurrence-form': function(e) {
        e.preventDefault();

        Requests.update({ _id: Session.get('req')._id }, {
            $push: {
                occurrences: {
                    client_name: $('#new-occurrence-form #client_name').val(),
                    occurrence: $('#new-occurrence-form #occurrence').val(),
                    previous_status: $('#new-occurrence-form #previous_status').val(),
                    current_status: $('#new-occurrence-form #status').val(),
                    createdAt: new Date()
                }
            }
        }, function(err, result) {
            if (err) {
                FlashMessages.sendError(err.error);
            } else {

            	Requests.update({ _id: Session.get('req')._id }, {
            		$set: {
            			status: $('#new-occurrence-form #status').val()
            		}
            	}, function (err, result) {
            		if (err) {
                		FlashMessages.sendError(err.error);
            		} else {
                		Session.unset();
                		Session.set('showRequest', true);

                		FlashMessages.sendSuccess("Ocorrência criada com sucesso!");
            		}
            	});
            }
        });
    },

    'click .cancel-occurrence': function(e) {
        e.preventDefault();

        Session.unset();
        Session.set('showRequest', true);
    },
    'click .follow': function(e) {
        e.preventDefault();

        var request = Requests.findOne({ _id: this._id });

        Session.unset();
        Session.set('req', request);
        Session.set('showRequest', true);
    }
});
