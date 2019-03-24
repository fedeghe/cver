![cver logo](https://raw.githubusercontent.com/fedeghe/cver/master/source/cvermini.png)  
---
#### Purpose

Provide a programmatic flexible and easy way to create cool automatically translated CV's.

#### How
Given a config file, which basically contains informations about which blocks and style to use, and obviously the text content for each of those. You can write the text in almost any language and get the output pdf in any other; more or less as follows:
``` js
const Cver = require('./cver'),
    cver = new Cver(),
    config = {
        /* setting content */
    };
cver.setup(config);
cver.print();
```
that's it.

The documentation for the config will come soon, as far as I have a stable one. Check the `source/index.js`, this is the file I am using as playgorund.

#### Config documentation
... not written yet
#### Available blocks and themes
... not written yet

---

##### Development todoList
- [x] create the P.O.C. based on trial templates, components and styles
- [ ] finalize the config structure
- [ ] document the config structure
- [ ] create a decent set of blocks, styles, and document them
- [ ] document how new blocks/styles can be added and consumed