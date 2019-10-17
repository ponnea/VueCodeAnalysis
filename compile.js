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
                console.log('编译元素'+node.nodeName);
            } else if(this.isInterPolation(node)) {
                console.log('编译文本'+node.textContent);
            }
            if(node.childNodes && node.childNodes.length > 0){
                this.compile(node);
            }
        })
    }
    isElement (node) {
        return node.nodeType === 1;
    }
    isInterPolation (node) {
        return node.nodeType ===3 && /\{\{.*\}\}/.test(node.textContent);
    }
}