import { Template } from 'meteor/templating';

import './login.html';
import './register.html';
import '../dashboard/dashboard.html';

if (Meteor.isClient) {
    Template.login.events({
        'submit #login-form': function(event) {
            event.preventDefault();

            var email = $('#email').val(),
                password = $('#password').val();

            Meteor.loginWithPassword(email, password, function(err) {
                if (err) {

                    console.log('err', err);
                    if (err.error == 403) {
                        switch (err.reason) {
                            case 'User not found':
                                err.reason = "Usuário não encontrado!"
                            break;

                            case 'Incorrect password':
                                err.reason = "Senha incorreta!";
                            break;

                            default:
                            break;
                        }
                        $('.main-login-container').html('<div class="alert alert-danger login-message">' + err.reason + '</div>');
                    }
                }

                Session.set('showRegister', false);
                Session.set('lastRequests', true);
            });
        },
        'submit #register-form': function(event) {
            event.preventDefault();

            Accounts.createUser({
                email: $('#email').val(),
                password: $('#password').val()
            }, function(err) {
                console.log('err', err);

                if (err.error == 403) {

                    switch (err.reason) {
                        case 'Email already exists.':
                            err.reason = 'E-mail já existe!';
                        break;

                        default:
                        break;
                    }
                    $('.main-register-container').html('<div class="alert alert-danger register-message">' + err.reason + '</div>');
                }
            });
        },
        'click .register-link': function(e) {
            e.preventDefault();
            Session.set('showRegister', true);
        },
        'click .login-link': function(e) {
            e.preventDefault();
            Session.set('showRegister', false);
        }
    });

    Template.login.helpers({
        'showRegister': function() {

            console.log('showRegister', Session.get('showRegister'));

            return Session.get('showRegister');
        }
    });
}
