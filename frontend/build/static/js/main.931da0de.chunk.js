(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{274:function(e,t,a){e.exports=a(573)},279:function(e,t,a){},408:function(e,t){},438:function(e,t){},440:function(e,t){},474:function(e,t){},573:function(e,t,a){"use strict";a.r(t);var n,r=a(1),s=a.n(r),o=a(75),i=a.n(o),c=(a(279),a(76)),l=a(77),u=a(46),m=a(78),h=a(47),d=a(591),p=a(592),g=a(593),f=a(34),w=a.n(f),v=a(65),b=a(587),E=a(582),k=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];return(a=Object(u.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={loadingData:!1},a}return Object(h.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=Object(v.a)(w.a.mark(function e(){return w.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.setState({loadingData:!0}),document.title="Azure UI",this.setState({loadingData:!1});case 3:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){return this.state.loadingData?s.a.createElement(b.a,{active:!0,inverted:!0},s.a.createElement(E.a,{size:"massive"},"Loading...")):s.a.createElement("div",null,s.a.createElement("h1",null,"Hi There!"))}}]),t}(r.Component),y=a(584),M=a(590),j=a(244),x=a(583),O=function(){return s.a.createElement(M.a,{style:{marginTop:"0px"},size:"large"},s.a.createElement(M.a.Item,null,s.a.createElement(x.a,{to:"/"},"Azure UI")),s.a.createElement(M.a.Menu,{position:"right"},s.a.createElement(M.a.Item,null,s.a.createElement(x.a,{to:"/helloworld"},s.a.createElement(j.a,{name:"tasks"}),"Hello World!"))))},A=function(e){return s.a.createElement(y.a,null,s.a.createElement("link",{rel:"stylesheet",href:"//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"}),s.a.createElement(O,null),e.children)},P=a(588),z=a(586),S=a(585),D=a(589),T=a(111),I=a.n(T);function C(){return(C=Object(v.a)(w.a.mark(function e(){return w.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,n.eth.getAccounts();case 2:null==e.sent[0]&&alert("Please Login To MetaMask And Refresh Page");case 4:case"end":return e.stop()}},e,this)}))).apply(this,arguments)}if("undefined"!==typeof window&&"undefined"!==typeof window.web3)n=new I.a(window.web3.currentProvider),function(){C.apply(this,arguments)}();else{alert("Please Install MetaMask from metamask.io");var H=new I.a.providers.HttpProvider("http://ethygqbek-dns-reg1.eastus.cloudapp.azure.com:8540");n=new I.a(H)}n.eth.net.getNetworkType(function(e,t){switch(t){case"main":alert("This is Mainnet. Please switch to Azure PoA Network!");break;case"ropsten":alert("This is Ropsten test network. Please switch to Azure PoA Network!");break;case"rinkeby":alert("This is Rinkeby test network! Please switch to Azure PoA Network!");break;case"kovan":alert("This is Kovan test network. Please switch to Azure PoA Network!")}});var N=n,W=new N.eth.Contract([{constant:!1,inputs:[{name:"text",type:"string"}],name:"postMsg",outputs:[],payable:!1,stateMutability:"nonpayable",type:"function"},{constant:!0,inputs:[],name:"getMsg",outputs:[{name:"",type:"string"}],payable:!1,stateMutability:"view",type:"function"}],"0xdcca47d0396ccdd76fbfe9dc779f619184df9357"),L=function(e){function t(){var e,a;Object(c.a)(this,t);for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];return(a=Object(u.a)(this,(e=Object(m.a)(t)).call.apply(e,[this].concat(r)))).state={loadingData:!1,errorMessage:"",msg:"",msgVal:"",account:"",existingMsg:""},a.onSubmit=function(){var e=Object(v.a)(w.a.mark(function e(t){var n;return w.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t.preventDefault(),a.setState({errorMessage:"",loading:!0,msg:""}),e.prev=2,e.next=5,W.methods.postMsg(a.state.msgVal).send({from:a.state.account});case 5:n=e.sent,console.log(n),a.setState({msg:"Message pushed to Azure PoA blockchain!"}),e.next=14;break;case 10:e.prev=10,e.t0=e.catch(2),console.log(e.t0),a.setState({errorMessage:e.t0.message,msg:""});case 14:a.setState({loading:!1});case 15:case"end":return e.stop()}},e,this,[[2,10]])}));return function(t){return e.apply(this,arguments)}}(),a}return Object(h.a)(t,e),Object(l.a)(t,[{key:"componentDidMount",value:function(){var e=Object(v.a)(w.a.mark(function e(){var t,a;return w.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return this.setState({loadingData:!0}),document.title="Azure UI | HelloWorld",e.next=4,N.eth.getAccounts();case 4:return t=e.sent,e.next=7,W.methods.getMsg().call({from:t[0]});case 7:a=e.sent,this.setState({loadingData:!1,account:t[0],existingMsg:a});case 9:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e,t=this;return this.state.loadingData?s.a.createElement(b.a,{active:!0,inverted:!0},s.a.createElement(E.a,{size:"massive"},"Loading...")):(e=""===this.state.msg?null:s.a.createElement(P.a,{floating:!0,positive:!0,header:"Success!",content:this.state.msg}),s.a.createElement("div",null,s.a.createElement("h1",null,"Hello World Contract!"),s.a.createElement("h3",null,"Existing message: ",this.state.existingMsg),s.a.createElement(z.a,{onSubmit:this.onSubmit,error:!!this.state.errorMessage},s.a.createElement(z.a.Group,null,s.a.createElement(z.a.Field,{width:12},s.a.createElement("label",null,"Enter Message"),s.a.createElement(S.a,{onChange:function(e){return t.setState({msgVal:e.target.value})}})),s.a.createElement(D.a,{size:"small",floated:"right",primary:!0,basic:!0,loading:this.state.loading,disabled:this.state.loading},"Push")),s.a.createElement(P.a,{error:!0,header:"Oops!",content:this.state.errorMessage}),e)))}}]),t}(r.Component),R=function(e){function t(){return Object(c.a)(this,t),Object(u.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(h.a)(t,e),Object(l.a)(t,[{key:"render",value:function(){return s.a.createElement(d.a,null,s.a.createElement(A,null,s.a.createElement(p.a,null,s.a.createElement(g.a,{exact:!0,path:"/",component:k}),s.a.createElement(g.a,{exact:!0,path:"/helloworld",component:L}))))}}]),t}(r.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(s.a.createElement(R,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[274,2,1]]]);
//# sourceMappingURL=main.931da0de.chunk.js.map