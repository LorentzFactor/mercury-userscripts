// ==UserScript==
// @name         Mercury Preview/Run Template User Quick Picks
// @namespace    https://github.com/curtgrimes/mercury-userscripts
// @version      1.0
// @description  Adds one-click user 'quick picks' to the initial preview/run template screen.
// @author       Curt Grimes
// @match        *://*/RunFeature/RunFeature?ftl=*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.8/dist/vue.min.js
// @run-at document-idle
// @updateURL   https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-template-user-quick-picks.js
// @downloadURL https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-template-user-quick-picks.js
// ==/UserScript==

(function () {
	'use strict';

	// Add parent container for quick picker
	document.querySelector('[rmscomponenttype="PersonSelection"]').insertAdjacentHTML('afterEnd', '<div id="customUserShortcuts">asdf</div>');

	// Add style
	var css = document.createElement("style");
	css.type = "text/css";
	css.innerHTML = "[rmscomponenttype='PersonSelection'] .MecuryAdvancedEntry { padding-bottom:40px }";
	document.body.appendChild(css);

	new Vue({
		el: '#customUserShortcuts',
		template: '\
		<div> \
			<p v-if="editMode"><strong>Edit quick picks</strong></p> \
			<p v-else><strong>Quick pick a user</strong></p> \
			<ul> \
			<li v-for="(user, index) in users" :key="index"> \
				<div v-if="user.editing"> \
				<input \
					ref="addUserInputRMSId" \
					placeholder="RMS ID" \
					type="text" \
					v-model="user.rmsIdBeingEdited" \
				/> \
				<input \
					ref="addUserInputName" \
					placeholder="Quick pick name" \
					type="text" \
					v-model="user.nameBeingEdited" \
				/> \
				<button type="button" @click="save(index)">Save</button> \
				<button type="button" @click="user.editing = false">Cancel</button> \
				</div> \
				<div v-else-if="editMode"> \
				{{ user.name }} <small>(RMS ID {{ user.rmsId }})</small> \
				<span style="font-size:80%"><a href="javascript:void(0)" @click="user.editing = true">Edit</a> \
				&nbsp;&nbsp;<a href="javascript:void(0)" @click="deleteUser(index)" >Delete</a></span> \
				</div> \
				<div v-else> \
				<a href="javascript:void(0)" @click="runAsUser(user)">{{user.name}}</a> \
				<small>(RMS ID {{ user.rmsId }})</small> \
				</div> \
			</li> \
			</ul> \
			<p v-if="!editMode" style="font-size:90%"> \
			<a href="javascript:void(0)" @click="addUser()">Add...</a> \
			</p> \
			<p v-if="!editMode" style="font-size:90%"> \
			<a href="javascript:void(0)" @click="editMode = true">Edit...</a> \
			</p> \
			<p v-if="editMode" style="font-size:90%"> \
			<a href="javascript:void(0)" @click="editMode = false">Done</a> \
			</p> \
		</div> \
		',
		data: function () {
			return {
				editMode: false,
				users: [],
			};
		},
		mounted: function () {
			// Restore from local storage
			var quickPickUsers = window.localStorage.getItem('mercuryCustomQuickPickUsers');
			if (quickPickUsers) {
				try {
					quickPickUsers = JSON.parse(quickPickUsers);
				}
				catch (e) { }

				this.users = quickPickUsers;
			}
		},
		watch: {
			users: {
				handler: function () {
					this.users.forEach((user, index, arr) => {
						// Remove any empty, not being edited users
						if (!user.editing && !user.rmsId) {
							this.users.splice(index, 1);
						}

						if (!user.editing) {
							this.save(index);
						}
					});

					// Save to local storage
					window.localStorage.setItem('mercuryCustomQuickPickUsers', JSON.stringify(this.users));
				},
				deep: true
			},
		},
		methods: {
			addUser: function () {
				this.users.push({
					rmsId: '',
					rmsIdBeingEdited: '',
					name: '',
					nameBeingEdited: '',
					editing: true,
				});

				this.$nextTick(function () {
					(this.$refs.addUserInputRMSId || []).forEach(function (input) {
						input.focus();
					});
				});
			},
			save: function (userIndex) {
				this.users[userIndex].rmsId = this.users[userIndex].rmsIdBeingEdited;
				this.users[userIndex].name = this.users[userIndex].nameBeingEdited;
				this.users[userIndex].editing = false;
			},
			deleteUser: function (userIndex) {
				this.users.splice(userIndex, 1);
			},
			runAsUser: function (user) {
				// Set the user
				SetMAEData('#' + document.querySelector('.MAEControlOuter').getAttribute('id'), user.id, { RMSID: user.rmsId, TypeAheadID: user.name }, true);

				// Run the template
				document.querySelector('#NavButtonRunTemplate').click();
			},
		},
	});
})();