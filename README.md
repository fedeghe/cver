![cver logo](https://raw.githubusercontent.com/fedeghe/cver/master/source/cvermini.png)  
---
#### Purpose

Provide a programmatic, flexible and easy way to create cool automatically translated CVs in pdf format.

#### How
Simply providing the building blocks, in html with some placeholders for wording and for sub-blocks, and a configuration file to map the content into the blocks.  
You can write the text content in almost any language and get the output pdf in any other; more or less as follows:
``` js
const Cver = require('cver'),
    cver = new Cver(),
    config = {
        /* setting content */
    };
cver.setup(config);
cver.print();
```
that's it.

The documentation for the config will come soon, as far as I have a stable one. Check the `source/create.js`, this is the file I am using as playgorund.

#### Config documentation

....soon I'll write it ... now I'm too lazy now

#### Available blocks and themes
I created just one template with one theme, the one that was matching my favourite cv layout :D  
But You, ... yes ... You can create other awesome templates.

#### In case you are curious
Install deps:  

    @ npm i
    @ npm run buildev

let the build process go, will watch `source` and fresh build `dist` on meaningful editing. Now the `dist` folder is ready, try it running

    @ node dist/create.js dist/configs/fg_one.json
 
and check the content of the `out` folder when done.

---

##### todo
- [x] create the P.O.C. based on trial templates, components and styles
- [x] finalize the config structure
    - [x] sub-blocks added
- [ ] document the config structure
- [ ] create a decent set of blocks, styles, and document them
- [ ] document how new blocks/styles can be added and consumed