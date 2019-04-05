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
    | Living area copy/paste | [About][about-lacp] | [Install][install-lacp] |
    | Manage bed space/plan lists from template | [About][about-mbspl] | [Install][install-mbspl] |
    | Preview/run template user quick picks | [About][about-uqp] | [Install][install-uqp]  |
    | Run from template          | [About][about-rft]         | [Install][install-rft]     |
    | Search on enter            | [About][about-soe]         | [Install][install-soe]     |
    | Template quick search      | [About][about-tqs]         | [Install][install-tqs]     |
    | View "used by" for all filters at once            | [About][about-vub]         | [Install][install-vub]     |


[about-tqs]: #template-quick-search
[about-uqp]: #previewrun-template-user-quick-picks
[about-rft]: #run-from-template
[about-caft]: #configure-availability-from-template
[about-soe]: #search-on-enter
[about-vub]: #view-used-by-for-all-filters-at-once
[about-mbspl]: #manage-bed-spaceplan-lists-from-template
[about-lacp]: #living-area-copypaste

[install-tqs]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-template-quick-search.user.js
[install-uqp]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-template-user-quick-picks.user.js
[install-rft]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-run-from-template.user.js
[install-caft]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-configure-availability-from-template.user.js
[install-soe]: https://raw.githubusercontent.com/LorentzFactor/mercury-userscripts/master/mercury-search-on-enter.user.js
[install-vub]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-filter-view-used-by-for-all.user.js
[install-mbspl]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-manage-bed-plan-lists-from-template.user.js
[install-lacp]: https://raw.githubusercontent.com/curtgrimes/mercury-userscripts/master/mercury-living-area-copy-paste.user.js

## Userscripts

### Configure availability from template

[**Install**][install-caft]

![Configure availability from template](docs/images/mercury-configure-availability.png?raw=true "Configure availability from template")

Adds a "Configure Availability" option under the "I want to..." menu on the template editing screen. As of Mercury 3.0.9 configuring availability of a template is only possible from the template list view, not from the template editing screen.

<hr/>

### Living area copy/paste

[**Install**][install-lacp]

Adds tools for copying/pasting traced living area regions. Useful if you have buildings with multiple floors that have identical layouts. You can avoid having to trace multiple floors over again.

Go to a living area that is already traced and click the "Copy" button:

![Living area copy/paste](docs/images/mercury-living-area-copy-paste-1.png?raw=true "Living area copy/paste")

Go to the area you want to copy to, and click the "Paste" button:

![Living area copy/paste](docs/images/mercury-living-area-copy-paste-2.png?raw=true "Living area copy/paste")

Select a saved area.

![Living area copy/paste](docs/images/mercury-living-area-copy-paste-3.png?raw=true "Living area copy/paste")

The tool will now go through each area from the source floor and ask about which item on the destination floor that you want to map to it.

![Living area copy/paste](docs/images/mercury-living-area-copy-paste-4.png?raw=true "Living area copy/paste")

For example, if your source floor 3 had rooms 301, 302, and 303 traced, on your destination floor 4, it'll show you the outlines for 301, 302, and 303, and ask you which 4** room you want to map to those traced outlines.

<hr/>

### Manage bed space/plan lists from template

[**Install**][install-mbspl]

![Manage bed space/plan lists from template](docs/images/mercury-manage-bed-plan-lists-from-template.png?raw=true "Manage bed space/plan lists from template")

Adds a "manage bed space/plan lists" option under the "I want to..." menu on the template editing screen. As of Mercury 3.0.9 configuring availability of a template is only possible from the template list view.

<hr/>

### Preview/run template user quick picks

[**Install**][install-uqp]

![Preview/run template user quick picks](docs/images/mercury-user-quick-picks.gif?raw=true "Preview/run template user quick picks")

Adds one-click user 'quick picks' to the initial preview/run template screen.

<hr/>

### Run from template

[**Install**][install-rft]

![Run from template](docs/images/mercury-run-template.png?raw=true "Run from template")

Adds a "Run Template" button to allow running a template directly from the template editing screen. As of Mercury 3.0.9 running a template is only possible from the template list view, not from the template editing screen.

<hr/>

### Search on enter

[**Install**][install-soe]

![Search on enter](docs/images/mercury-search-on-enter.gif?raw=true "Search on enter")

When using search filters above lists in the Mercury interface, allow pressing "enter" to start the search.

<hr/>

### Template quick search

[**Install**][install-tqs]

![Template quick search](docs/images/mercury-template-quick-search.gif?raw=true "Template quick search")

Adds a search-as-you-type box to the Mercury template list. This will search across all pages of templates.

<hr/>

### View "used by" for all filters at once

[**Install**][install-vub]

![View 'used by' for all filters at once](docs/images/mercury-filter-view-used-by-for-all.png?raw=true "View 'used by' for all filters at once")

Load the 'used by' information for all filters automatically. It will still take a long time, but you don't need to manually click on each filter and look for this information, and wait for each lookup to end before going to the next. You can let it run in the background while you do something else.
