# Atlassian Crowd Helper Browser Extension

or ACHBrE for short. This a browser extension to aid with the administration
of [Atlassian Crowd](https://www.atlassian.com/software/crowd).

## Overview

Atlassian Crowd is meant to be an identity provider. Originally existed as an internal user directory library for
Atlassian products, and later it manifested into a standalone product.

When using Crowd to actually manage users and groups , especially in multiple internal or external directories, one
might find that there is room for optimizing clicks and workflows. This is where this browser extension kicks in.
Providing click optimization, shortcuts and automation, Crowd administrators might spare a few clicks here and there.
With repeated tasks, this can be a noticeable time and sanity saver.

Atlassian Crowd Helper Browser Extension can be especially helpful when administering users and groups across multiple
directories.

## License

ACHBrE is a [free software](http://www.gnu.org/licenses/quick-guide-gplv3.html) licensed
under [GNU/GPL v3.0](LICENSE.md). You are free to use, share and modify it as long as you obey the rules laid out by
GNU/GPL license - basically, your modified copy must also be licensed under GNU/GPL.

### 3rd Party Libraries

#### Extension Settings Page Visual Styling

* [Bootstrap](https://getbootstrap.com) is licensed
  under [MIT license and is copyright 2018 Twitter](https://getbootstrap.com/docs/4.0/about/license/).
* [JQuery](https://jquery.org/) is licensed under [MIT license](https://jquery.org/license/)

## Supported Platforms

### Browsers

* Google Chrome Version 89 and up

### Crowd

Tested on Crowd 4.2.3 DataCenter. Should work on Server edition as well, although some Crowd features are only available
in DC edition such as clustering and delegated group administration.

## Features

### Create User Helper

*Problem: Crowd marks every input field as required. This can be very time-consuming, especially when creating bot users
that might not even have e-mail address and no one really cares about their *name**.

ACHBrE will auto-generate password, autofill e-mail address, family name and given name inputs.

### Add Group Helper

*Problem: Crowd navigates to the newly created group right away, preventing quick addition of multiple groups.*

ACHBrE prevents Crowd from navigating away from Group Add view, which allows adding multiple directories in rapid
succession.

*Problem: Crowd manages groups on a directory level. So if you need to have group members from multiple directories, you
need to create that group in each and every directory.

With ACHBrE, groups can be added to all directories at once.

### Remove Group Helper

*Problem: you created a group in multiple directories, and this group is not needed anymore. One has to go through all
directories, search the given group in the given directory and remove one by one.*

ACHBrE will allow to remove a given group from all directories at once.

### Application Directory Permission Helper

*Problem: when creating an Application (a consumer to Crowd), and/or assigning new directory to that application, *Crowd
grants write access for that application to the given directory. *This is a security problem in itself.**

ACHBrE will not (yet) prevent Crowd from doing this, but will certainly help you with *removing* insecure permissions,
by providing you with a button to remove all (write) permissions from all directories assigned to a given application.

## Installing

### Google Chrome: unpacked extension

*Adding unpacked extension
requires [developer mode to be turned on in Google Chrome](https://developer.chrome.com/docs/extensions/mv2/faq/#:~:text=You%20can%20start%20by%20turning,a%20packaged%20extension%2C%20and%20more.)
.*

1. Clone the repository to your local disk
1. Open [Chrome Extensions](chrome://extensions)
1. Click ```Load unpacked``` button
1. Browse to the ```src/google-chrome``` directory within the downloaded repository

Once installed, you need to *enable* the plugin on each Crowd UI URL you intend to use it on.

### Installing [Bootstrap](https://getbootstrap.com) for Options page visual styling (optional)

1. Create directory ```src/google-chrome/vendor/bootstrap```
1. Go to [Download Bootstrap 4.6](https://getbootstrap.com/docs/4.6/getting-started/introduction/)
1. Download components form the above link into the ```src/google-chrome/vendor/bootstrap``` directory
   and rename the downloaded files to exclude version numbers.
   
The result should be something like this:
```
src/google-chrome/vendor/bootstrap/bootstrap.min.css
src/google-chrome/vendor/bootstrap/bootstrap.bundle.min.js
src/google-chrome/vendor/bootstrap/jquery.slim.min.js
```

## Why browser extension and not Crowd plugin?

* Developing browser extension only requires basic JavaScript and HTML knowledge
* It lives in the browser, so it does not require any modification in Atlassian Crowd.
* It is lightweight and can be turned on and off at any given time. Or just simply launch an incognito window, and you
  get the vanilla Crowd experience.

## Is this extension safe?

Do not take our word for it. The source code is available for auditing.

## Will it damage my Crowd?

Although it is very unlikely, mistakes might happen. Theoretically, a mis-behaving JavaScript can do *anything* on the
given website. We recommend testing in a development environment first.

*We do not take any responsibility should a bug do nasty things like deleting all your groups*

## Known problems

ACHBrE is a very young piece of software. As it has very few features, most problems should be *missing* features.
Anyway, see Issues page for more information, and feel free to submit bug reports and feature requests as well as pull
requests.
