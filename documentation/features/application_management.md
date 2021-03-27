# Application Management - Crowd Helper Features

## Removing Application Directory Insecure Default Permissions
*Problem: when creating an Application (a consumer to Crowd), and/or assigning new directory to that application,
 **Crowd grants write access by default** for that application to the given directory.
  **This is a security problem in itself.**

**ACHBrE will not prevent Crowd from doing this**, but will certainly help with *removing* insecure permissions,
by enabling to remove all (write) permissions from all directories assigned to a given application with a single
click. Well, actually, two clicks, counting the confirmation message.
