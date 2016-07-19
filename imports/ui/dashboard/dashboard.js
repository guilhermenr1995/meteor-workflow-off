import { Template } from 'meteor/templating';

import { Requests } from '../../api/requests.js';

import './dashboard.html';
import '../request/request.html';
import '../request/last_requests.html';
import '../request/show_request.html';
import '../occurrence/occurrence.html';

Template.dashboard.helpers({
    userEmail() {
        return Meteor.user().emails[0].address;
    },
    lastRequests() {
        return Session.get('lastRequests');
    },
    newRequest() {
        return Session.get('newRequest');
    },
    showRequest() {
        return Session.get('showRequest');
    },
    newOccurrence() {
        return Session.get('newOccurrence');
    }
});

Template.last_requests.helpers({
    requests() {
        return Requests.find({});
    },
    status_processing(status) {
        return status == 'Processando';
    }
});

Template.show_request.helpers({
    requestName() {
        return Session.get('req').name;
    }
});

Template.occurrence.helpers({
    requestName() {
        return Session.get('req').name;
    },
    userEmail() {
        return Meteor.user().emails[0].address;
    },
});

Template.show_request.helpers({
    occurrences() {
        return Requests.find({ _id: Session.get('req')._id });
    },
    equals(one, two) {
    	if (one == two) {
    		return '<a href="#" class="new-occurrence btn btn-warning"><i class="fa fa-edit"></i></a>';
    	}    
    }
});


Template.dashboard.rendered = function() {
    Session.set('lastRequests', true);
};

//Para zerar as variáveis de sessão
Session.unset = function() {
    _.each(Session.keys, function(value, key) {
        // Só pra manter a última requisição clicada
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
    'submit #new-request-form': function(e) {
        e.preventDefault();

        Requests.insert({
            name: $('#new-request-form #name').val(),
            file: $('#new-request-form #form')[0].files,
            status: 'Processando',
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
    },

    'submit #new-occurrence-form': function(e) {
        e.preventDefault();

        Requests.update({ _id: Session.get('req')._id }, {
            $push: {
                occurrence: {
                    client_name: $('#new-occurrence-form #client_name').val(),
                    occurrence: $('#new-occurrence-form #occurrence').val(),
                    createdAt: new Date()
                }
            }
        }, function(err, result) {
            if (err) {
                FlashMessages.sendError(err.error);
            } else {

                Session.unset();
                Session.set('showRequest', true);

                FlashMessages.sendSuccess("Ocorrência criada com sucesso!");
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
