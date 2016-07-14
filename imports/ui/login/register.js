import { Template } from 'meteor/templating';

import './login.html';
import './register.html';

if (Meteor.isClient) {
    Template.register.events({
        'submit #register-form': function(event) {
            event.preventDefault();

            Accounts.createUser({
                email: $('#email').val(),
                password: $('#password').val()
            }, function (err) {
            	console.log('ativou register');
            });
        }
    });
}
