//new sVue(data{}) 引用规范
class sVue {
    constructor (options) {
        this.$options = options;
        this.$data =options.data;
        this.observe(this.$data);
        // new Watcher();
        // this.$data.test;
        new Compile(options.el,this);
    }

    observe (obj) {
        if(!obj || typeof(obj) != 'object') {
            return;
        }
        //遍历对象
        Object.keys(obj).forEach(key => {
            this.defineReactive(obj,key,obj[key]);
        })
    }
    // 定义数据响应
    defineReactive (obj,key,val ) {
        this.observe(val)
        var dep = new Dep();
        // console.log(dep.target)
        Object.defineProperty(obj,key, {
            get () {
                Dep.target && dep.addDep(Dep.target)
                return val;
            },
            set (newVal) {
                if (val === newVal) {
                    return;
                }
                val = newVal;
                // console.log(key+'产生更新: '+val)
                dep.notify();
            }
        })
    }
}
class Dep {
    constructor () {
        //存放需要监听的属性
        // console.log(this.target)
        this.deps = [];
    }
    addDep (dep) {
        this.deps.push(dep);
    }
    notify () {
        // console.log(this.deps)
        this.deps.forEach(dep => dep.update());
    }
}

class Watcher {
    constructor () {
        Dep.target = this;
        // console.log(Dep.target)
    }
    update() {
        console.log(`属性更新`)
    }
}