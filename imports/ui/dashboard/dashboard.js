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


Template.dashboard.rendered = function() {
    Session.set('lastRequests', true);
};

Template.dashboard.events({
    'click .logout-btn': function(e) {
        e.preventDefault();
        Session.keys = {};
        Meteor.logout();
    },
    'click .new-request': function(e) {
        e.preventDefault();

        Session.set('lastRequests', false);
        Session.set('ShowRequest', false);
        Session.set('newRequest', true);
    },
    'click .cancel-request': function(e) {
        e.preventDefault();

        Session.set('newRequest', false);
        Session.set('showRequest', false);
        Session.set('lastRequests', true);
    },
    'click .new-occurrence': function(e) {
        e.preventDefault();

        Session.set('lastRequests', false);
        Session.set('ShowRequest', false);
        Session.set('newOccurrence', true);

        console.log('Session.get(',Session.get('newOccurrence'));
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
                $('.new-request-response').html('<div class="alert alert-danger">' + err.error + '</div>');
            } else {

                Session.set('newRequest', false);
                Session.set('lastRequests', true);

                $('.new-request-response-table').html('<div class="alert alert-success">Requisição criada com sucesso!</div>');
            }
        });
    },
    'click .follow': function (e) {
    	e.preventDefault();

    	var id = $(this).data('id');

    	var request = Requests.findOne({id: id});

    	console.log('request', request);

    	Session.set('lastRequests', false);
    	Session.set('showRequest', true);
    	Session.set('req', request);
    }
});
