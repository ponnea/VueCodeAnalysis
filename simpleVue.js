//new sVue(data{}) 引用规范
class sVue {
    constructor (options) {
        this.$options = options;
        this.$data =options.data;
        this.observe(this.$data);
        // new Watcher();
        // this.$data.test;
        new Compile(options.el,this);

        if(options.created) {
            options.created.call(this);   
        }
    }

    observe (obj) {
        if(!obj || typeof(obj) != 'object') {
            return;
        }
        //遍历对象
        Object.keys(obj).forEach(key => {
            this.defineReactive(obj,key,obj[key]);
            // 代理data中的属性到vue示例中
            this.proxyData(key);
        })
    }
    proxyData (key) {
        Object.defineProperty(this, key, {
            get () {
                return this.$data[key];
            },
            set (newVal) {
                this.$data[key] = newVal;
            }
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
    constructor (vm, key, cb) {
        this.vm = vm;
        this.key = key;
        this.cb = cb;
        Dep.target = this;
        this.vm[this.key];//触发get
        Dep.target = null;
        // console.log(Dep.target)
    }
    update() {
        // console.log(`属性更新`)
        this.cb.call(this.vm, this.vm[this.key]);
    }
}