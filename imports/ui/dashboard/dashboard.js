import { Template } from 'meteor/templating';

import './dashboard.html';

Template.dashboard.helpers({
  userEmail() {
  	return Meteor.user().emails[0].address;
  }
});


Template.dashboard.events({
	'click .logout-btn': function (e) {
		e.preventDefault();
		Meteor.logout();
	}
});