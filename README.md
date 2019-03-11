# Mercury Userscripts
A collection of userscripts that add functionality to the [RMS Mercury](https://mercury.rms-inc.com/mercury.html) interface used by administrators using Mercury to build templates. This does not offer any new functionality on user-facing public templates.

These userscripts are meant to offer some solutions to common inconveniences you may encounter if you are a Mercury power user. 

## Installation
1. Install the Tampermonkey extension in your browser:
	* [Tampermonkey for Chrome](https://tampermonkey.net/?ext=dhdg&browser=chrome)
	* [Tampermonkey for Firefox](https://tampermonkey.net/?ext=dhdg&browser=firefox)
	* [Tampermonkey for Microsoft Edge](https://tampermonkey.net/index.php?ext=dhdg&browser=edge)
	* [Tampermonkey for Opera](https://tampermonkey.net/?ext=dhdg&browser=opera)
	* [Tampermonkey for Safari](https://tampermonkey.net/?ext=dhdg&browser=safari)

2. Install the userscripts that you want to use.

    | Userscript                 | About                      | Install                    |
    | -------------------------- |:-------------------------- |:-------------------------- |
    | Configure availability from template | [About][about-caft] | [Install][install-caft] |
    | Preview/run template user quick picks | [About][about-uqp] | [Install][install-uqp]  |
    | Run from template          | [About][about-rft]         | [Install][install-rft]     |
    | Search on enter            | [About][about-soe]         | [Install][install-soe]     |
    | Template quick search      | [About][about-tqs]         | [Install][install-tqs]     |
    | View "used by" for all filters at once            | [About][about-vub]         | [Install][install-vub]     |


[about-tqs]: #template-quick-search
[about-uqp]: #preview-run-template-user-quick-picks
[about-rft]: #run-from-template
[about-caft]: #configure-availability-from-template
[about-soe]: #search-on-enter
[about-vub]: #view-used-by-for-all-filters-at-once

[install-tqs]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-template-quick-search.user.js
[install-uqp]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-template-user-quick-picks.user.js
[install-rft]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-run-from-template.user.js
[install-caft]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-configure-availability-from-template.user.js
[install-soe]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-search-on-enter.user.js
[install-vub]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-filter-view-used-by-for-all.user.js


## Userscripts

### Configure availability from template

![Configure availability from template](docs/images/mercury-configure-availability.png?raw=true "Configure availability from template")

Adds a "Configure Availability" option under the "I want to..." menu on the template editing screen. As of Mercury 3.0.9 configuring availability of a template is only possible from the template list view, not from the template editing screen.

### Preview/run template user quick picks

![Preview/run template user quick picks](docs/images/mercury-user-quick-picks.gif?raw=true "Preview/run template user quick picks")

Adds one-click user 'quick picks' to the initial preview/run template screen.

### Run from template

![Run from template](docs/images/mercury-run-template.png?raw=true "Run from template")

Adds a "Run Template" button to allow running a template directly from the template editing screen. As of Mercury 3.0.9 running a template is only possible from the template list view, not from the template editing screen.

### Search on enter

![Search on enter](docs/images/mercury-search-on-enter.gif?raw=true "Search on enter")

When using search filters above lists in the Mercury interface, allow pressing "enter" to start the search.

### Template quick search

![Template quick search](docs/images/mercury-template-quick-search.gif?raw=true "Template quick search")

Adds a search-as-you-type box to the Mercury template list. This will search across all pages of templates.

### View "used by" for all filters at once

![View 'used by' for all filters at once](docs/images/mercury-filter-view-used-by-for-all.png?raw=true "View 'used by' for all filters at once")

Load the 'used by' information for all filters automatically. It will still take a long time, but you don't need to manually click on each filter and look for this information, and wait for each lookup to end before going to the next. You can let it run in the background while you do something else.
