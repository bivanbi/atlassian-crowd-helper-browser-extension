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
under [GNU/GPL v3.0](LICENSE.md). ACHBrE is free to use, share and modify it as long the rules laid out by
GNU/GPL license are obeyed.

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
Most features are for click optimization and to eliminate repetitive tasks when managing multiple user directories.

* Focus the most relevant input when opening a page or form, so one can begin to type / paste input right away
* Speed up user creation by auto-filling inputs
* Speed up application / user / group operations when having multiple user directories

See [Documentation](documentation/index.md)/[Features](documentation/features/index.md) for more details.

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
