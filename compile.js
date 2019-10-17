class Compile {
    constructor(el,vm) {
        this.$vm = vm
        //遍历的节点
        this.$el = document.querySelector(el)

        if (this.$el) {
            this.$fragment = this.nodeToFragment(this.$el)
            this.compile(this.$fragment)
            this.$el.appendChild(this.$fragment)
        }
    }
    //将宿主元素中的代码取出进行遍历
    nodeToFragment (el) {
        const fragment = document.createDocumentFragment();
        let child;
        while(child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    }
    compileElement (el) {
        
    }
    compile(el){
        const childNodes = el.childNodes;
        Array.from(childNodes).forEach(node => {
            if(this.isElement(node)) {
                // console.log('编译元素'+node.nodeName);
                // s- : @
                const nodeAttrs = node.attributes;
                Array.from(nodeAttrs).forEach(attr => {
                    const attrName = attr.name;//属性名
                    const exp = attr.value;//属性值
                    if (this.isDirective(attrName)) {
                        const dir = attrName.substring(2);
                        this[dir] && this[dir](node,this.$vm,exp);
                    } else if(this.isEvent(attrName)) {
                        const dir = attrName.substring(1);
                        this.eventHandler(node,this.$vm,exp,dir)
                    }
                })
            } else if(this.isInterPolation(node)) {
                this.compileText(node);
                // console.log('编译文本'+node.textContent);
            }
            if(node.childNodes && node.childNodes.length > 0){
                this.compile(node);
            }
        })
    }
    isElement (node) {
        return node.nodeType === 1;
    }
    // 判断当前节点内有插值表达式
    isInterPolation (node) {
        return node.nodeType ===3 && /\{\{(.*)\}\}/.test(node.textContent);
    }
    // 当前节点内有插值表达式
    compileText (node) {
        // console.log()
        this.update(node, this.$vm,RegExp.$1, 'text')
    }
    // 代理更新方法
    update (node, vm, exp, dir) {
        const updateFn = this[dir+'Updater'];
        console.log(exp)
        updateFn && updateFn(node,vm[exp]);
        new Watcher(vm, exp, function(value) {
            updateFn && updateFn(node,value);
        })
    }
    //   事件处理器
    eventHandler(node, vm, exp, dir) {
        //   @click="onClick"
        let fn = vm.$options.methods && vm.$options.methods[exp];
        if (dir && fn) {
        node.addEventListener(dir, fn.bind(vm));
        }
    }
    // 插值更新
    textUpdater (node, value) {
        console.log(value)
        node.textContent = value
    }
    isDirective (attrName) {
        return attrName.indexOf('s-') == 0;
    }
    text (node, vm, exp) {
        this.update(node, vm, exp, 'text')
    }
    isEvent (attrName) {
        return attrName.indexOf('@') == 0;
    }
}