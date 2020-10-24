(this["webpackJsonpmy-app"]=this["webpackJsonpmy-app"]||[]).push([[0],{75:function(e,t,n){e.exports=n(89)},80:function(e,t,n){},81:function(e,t,n){},82:function(e,t,n){},89:function(e,t,n){"use strict";n.r(t);var a,r,o=n(0),i=n.n(o),s=n(12),c=n.n(s),l=(n(80),n(81),n(82),n(8)),u=n.n(l),p=n(4),d=n.n(p),h=n(10),m=n(13),f=n(14),g=n(16),b=n(15),x=n(17),v=n(120),y={getAccessToken:function(e){if(a)return this.getUser(a),a;var t=window.location.href.match(/access_token=([^&]*)/),n=window.location.href.match(/expires_in=([^&]*)/),o=window.location.href.match(/refresh_token=([^&]*)/);if(console.log("refreshTokenMatch"),console.log(o),t&&n)return a=t[1],r=n[1],u.a.set("accessToken",a),window.setTimeout(Object(h.a)(d.a.mark((function e(){var t;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return alert("You are being logged out"),a="",u.a.remove("accessToken"),u.a.remove("user"),"https://www.spotify.com/logout/",e.next=7,window.open("https://www.spotify.com/logout/","Spotify Logout","width=100,height=100,top=0,left=0");case 7:t=e.sent,setTimeout((function(){return null===t||void 0===t?void 0:t.close()}),1),window.location.reload();case 10:case"end":return e.stop()}}),e)}))),1e3*Number.parseInt(r)),window.history.pushState("Access Token","","/"),this.getUser(a),a;if(e)return!1;window.location.href="https://accounts.spotify.com/authorize?client_id=".concat("ca1cbc4582c8437d9322b5098114f980","&response_type=token&scope=").concat(encodeURIComponent("user-read-private user-top-read playlist-modify-public user-read-recently-played"),"&redirect_uri=").concat("http://bullpen.trevorflanigan.com/authorize/"),u.a.remove("accessToken"),a="",r=""},isLoggedIn:function(){return!!y.getAccessToken(!0)},getUser:function(e){return Object(h.a)(d.a.mark((function t(){var n,a,r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(console.log("Getting user..."),!(n=u.a.get("user"))){t.next=4;break}return t.abrupt("return",n);case 4:return t.next=6,fetch("https://api.spotify.com/v1/me",{method:"get",headers:{Authorization:"Bearer ".concat(e||y.getAccessToken()),"Content-Type":"application/json"}});case 6:return a=t.sent,t.next=9,a.json();case 9:return r=t.sent,u.a.set("user",r),t.abrupt("return",r);case 12:case"end":return t.stop()}}),t)})))()}},k=y,w=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={redirect:!!u.a.get("user")},e}return Object(f.a)(n,[{key:"componentDidMount",value:function(){var e=Object(h.a)(d.a.mark((function e(){var t,n,a,r,o,i,s,c;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t={},n=window.location.href.match(/state=([^&]*)/),a=window.location.href.match(/code=([^&]*)/),n&&a){e.next=5;break}return e.abrupt("return");case 5:return e.next=7,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/users/token?code=").concat(a[1],"&state=").concat(n[1]));case 7:return r=e.sent,e.next=10,r.json();case 10:if(o=e.sent,i=o.access_token,s=o.expires_in,c=o.refresh_token,!i||!s){e.next=24;break}return e.next=15,k.getUser(i);case 15:return t=e.sent,e.next=18,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/users/createUser?accessToken=").concat(i,"&refreshToken=").concat(c),{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({display_name:t.display_name,followers:t.followers,href:t.href,id:t.id,images:t.images,uri:t.uri})});case 18:return console.log("Getting old flames"),e.next=21,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/music/forgotten?&uid=").concat(t.id),{method:"get",headers:{"Content-Type":"application/json"}});case 21:window.setTimeout((function(){i="",u.a.remove("user")}),1e3*Number.parseInt(s)),window.history.pushState("Access Token","","/"),u.a.get("user")&&window.location.reload();case 24:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){return o.createElement("section",{className:"section parallax bg1 flexcolumn",style:{placeItems:"center"}},this.state.redirect&&o.createElement(x.a,{to:"/"}),o.createElement("h1",{className:"App-title"},"Authorizing..."),o.createElement("div",{style:{display:"flex",placeItems:"center",placeContent:"center"}},o.createElement(v.a,null)))}}]),n}(o.Component),j=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(f.a)(n,[{key:"render",value:function(){return o.createElement("button",{style:{alignSelf:"flex-end",marginRight:10},onClick:Object(h.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:u.a.remove("user"),window.location.reload();case 2:case"end":return e.stop()}}),e)})))},"Log Out")}}]),n}(o.Component),E=n(124),O=n(6),S={green:"#1ED760",greenHover:"#4bdf80",blue:"#36C6A3",peach:"#F0BF91",orange:"#E5603C",red:"#CC5049"},C=Object(O.a)({root:{minWidth:"250px",color:"#fff",backgroundColor:S.green,"&:hover":{backgroundColor:S.greenHover},fontSize:"14px",lineHeight:1,borderRadius:"500px",transitionProperty:"background-color, box-shadow, filter",borderWidth:0,letterSpacing:"2px",whiteSpace:"normal",padding:"16px 14px 18px",fontFamily:"Proxima Nova",alignSelf:"center"}})(E.a),N=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(f.a)(n,[{key:"render",value:function(){return o.createElement(C,{onClick:Object(h.a)(d.a.mark((function e(){var t,n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/users/startToken"));case 2:return t=e.sent,e.next=5,t.json();case 5:n=e.sent,console.log(n),window.location.href=n.url;case 8:case"end":return e.stop()}}),e)})))},"Login")}}]),n}(o.Component),A=n(53),T=n(125),z=n(126),D=n(127),I=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={translate:0,color:"white",opacity:1,disabled:!1},e.removeAnimation=function(t,n){e.setState({color:"red",opacity:0,disabled:!0}),setTimeout((function(){n&&n(),e.setState({color:"white",opacity:1,disabled:!1})}),500)},e.likeAnimation=function(t,n){e.setState({color:"green",opacity:0,disabled:!0}),setTimeout((function(){n&&n(),e.setState({color:"white",opacity:1,disabled:!1})}),500)},e}return Object(f.a)(n,[{key:"render",value:function(){var e=this;if(!this.props.track)return o.createElement("div",null);var t=Object(O.a)({root:{minWidth:"10px",color:"white",backgroundColor:S.green,transition:"filter .3s",opacity:.8,margin:"3px","&:hover":{filter:"brightness(85%)",backgroundColor:S.green}}})(T.a),n=Object(O.a)({root:{minWidth:"10px",color:"white",backgroundColor:S.red,transition:"filter .3s",opacity:.8,margin:"3px","&:hover":{filter:"brightness(85%)",backgroundColor:S.red}}})(T.a);return o.createElement("div",{style:{opacity:this.state.opacity,transition:"opacity 1s",height:CSS.supports("aspect-ratio","1 / 1")?"60vh":"400px",width:CSS.supports("aspect-ratio")?"":"400px",aspectRatio:"1 / 1 ",backgroundImage:"url(".concat(this.props.track.album.images[0].url,")"),backgroundSize:"cover",backgroundRepeat:"no-repeat",display:"flex",flexDirection:"column",justifyContent:"space-between",position:"relative",borderRadius:"5px",marginLeft:"10px",marginRight:"10px"},className:"nohighlight"},o.createElement("div",{style:{display:"flex",flexDirection:"column",color:"#000000",fontSize:"40px",textShadow:"-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white",backgroundColor:this.state.color,opacity:"88%",borderTopRightRadius:"5px",borderTopLeftRadius:"5px"}},this.props.track.name),o.createElement("div",{style:{borderBottomRightRadius:"5px",borderBottomLeftRadius:"5px",backgroundColor:"white",opacity:"88%",display:"flex",flexDirection:"row",justifyContent:"space-around",textOverflow:"ellipsis",color:"#000000",overflow:"hidden",minWidth:0,textShadow:"-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white"}},o.createElement("div",null,o.createElement(n,{onClick:function(t){return e.removeAnimation(t,(function(){return e.props.remove(e.props.track.id)}))},disabled:this.state.disabled},o.createElement(z.a,null))),o.createElement("p",{style:{display:"flex",minHeight:0,fontSize:"calc(2vmin + 10px)",textOverflow:"ellipsis",wordBreak:"break-all",maxHeight:"50px",margin:0,padding:0,alignSelf:"center"}},this.props.track.artists[0].name),o.createElement("div",null,o.createElement(t,{onClick:function(t){return e.likeAnimation(t,(function(){return e.props.remove(e.props.track.id)}))},disabled:this.state.disabled},o.createElement(D.a,null)))))}}]),n}(o.Component),R=n(135),P=n(136),_=Object(O.a)({root:{minWidth:"250px",color:"#fff",backgroundColor:"#e29670","&:hover":{backgroundColor:"#e29670"},fontWeight:"bold",fontSize:"14px",lineHeight:1,borderRadius:"500px",transitionProperty:"background-color, box-shadow, filter",borderWidth:0,letterSpacing:"2px",whiteSpace:"normal",padding:"16px 14px 18px",fontFamily:"Proxima Nova",alignSelf:"center"}})(E.a),B=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={tracks:[],index:0,index1:1,index2:2,disabled:!1},e.handleAddAll=Object(h.a)(d.a.mark((function t(){var n,a,r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=JSON.parse(u.a.get("user")),a=e.state.tracks.slice(Math.min(e.state.index,e.state.index1,e.state.index2),e.state.tracks.length),r=a.map((function(e){return e.id})),console.log(r),t.next=6,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/music/forgotten?uid=").concat(n.id),{method:"put",headers:{"Content-Type":"application/json"},body:JSON.stringify({tracks:r})});case 6:t.sent.ok&&e.setState({index:e.state.tracks.length,index1:e.state.tracks.length,index2:e.state.tracks.length,disabled:!0});case 8:case"end":return t.stop()}}),t)}))),e.getForgottenFromDB=Object(h.a)(d.a.mark((function t(){var n,a,r,o;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=JSON.parse(u.a.get("user")||""),t.next=3,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/music/forgottenDB?uid=").concat(n.id),{method:"get",headers:{"Content-Type":"application/json"}});case 3:return a=t.sent,t.next=6,a.json();case 6:if(r=t.sent,e.setState((function(){return{tracks:r}})),0!=r.length){t.next=18;break}return console.log("Getting medium term instead"),t.next=12,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/music/forgotten?uid=").concat(n.id),{method:"get",headers:{"Content-Type":"application/json"}});case 12:return o=t.sent,console.log(o),t.next=16,o.json();case 16:r=t.sent,e.setState({tracks:r});case 18:return t.abrupt("return",r);case 19:case"end":return t.stop()}}),t)}))),e.incrementIndex=function(t){var n=Math.max(e.state.index,e.state.index1,e.state.index2)+1;0==t&&e.setState({index:n}),1==t&&e.setState({index1:n}),2==t&&e.setState({index2:n})},e.removeSong=function(){var t=Object(h.a)(d.a.mark((function t(n,a){var r,o;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if((r=JSON.parse(u.a.get("user")||"")).id){t.next=3;break}return t.abrupt("return");case 3:return e.incrementIndex(a),e.setState({tracks:e.state.tracks.slice(a,e.state.tracks.length)}),t.next=7,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/music/forgotten?uid=").concat(r.id),{method:"delete",headers:{"Content-Type":"application/json"},body:JSON.stringify({deleteIds:[n]})});case 7:return o=t.sent,t.next=10,o.json();case 10:t.sent;case 11:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),e.heart=function(){var t=Object(h.a)(d.a.mark((function t(n,a){var r,o;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(console.log(n),(r=JSON.parse(u.a.get("user")||"")).id){t.next=4;break}return t.abrupt("return");case 4:return e.incrementIndex(a),t.next=7,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/music/addforgotten?uid=").concat(r.id),{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify({toAdd:[n]})});case 7:return o=t.sent,t.t0=console,t.next=11,o.json();case 11:t.t1=t.sent,t.t0.log.call(t.t0,t.t1),console.log("done heart");case 14:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),e}return Object(f.a)(n,[{key:"componentDidMount",value:function(){var e=Object(h.a)(d.a.mark((function e(){var t,n,a,r;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=this.getForgottenFromDB(),e.next=3,Promise.all([t]);case 3:n=e.sent,a=Object(A.a)(n,1),r=a[0],this.setState((function(){return{tracks:r}})),console.log(this.state.tracks);case 8:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.props.width,n=Object(R.b)("xl",t),a=Object(R.b)("lg",t);return!this.state.tracks.length||Math.min(this.state.index,this.state.index1,this.state.index2)>=this.state.tracks.length?o.createElement("section",{className:"section parallax bg2 App-subtitle flexcolumn App-subtitle",style:{justifyContent:"space-between",height:"100%"}},o.createElement("h1",{style:{margin:0}},"Your Old Flames"),o.createElement("p",null,"We are looking for more old flames to suggest! Come back later")):this.state.tracks.length?o.createElement("section",{className:"section parallax bg2 App-subtitle2 flexcolumn App-subtitle",style:{justifyContent:"center",height:"100%"}},o.createElement("h1",{style:{margin:0}},"Your Old Flames"),o.createElement("span",{style:{height:"auto",display:"flex",justifyContent:"center"}},o.createElement(_,{disabled:this.state.disabled,variant:"contained",onClick:this.handleAddAll},"Add All ",this.state.tracks.length-Math.min(this.state.index,this.state.index1,this.state.index2)," Songs")),o.createElement("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",flexGrow:1}},o.createElement("div",{className:"parallax songCard"},this.state.tracks.length>0&&o.createElement(I,{track:this.state.tracks[this.state.index],heart:function(t){return e.heart(t,0)},remove:function(t){return e.removeSong(t,0)}})),o.createElement("div",{className:"parallax songCard"},a&&this.state.tracks.length>1&&o.createElement(I,{track:this.state.tracks[this.state.index1],heart:function(t){return e.heart(t,1)},remove:function(t){return e.removeSong(t,1)}})),o.createElement("div",{className:"songCard parallax"},n&&this.state.tracks.length>2&&o.createElement(I,{track:this.state.tracks[this.state.index2],heart:function(t){return e.heart(t,2)},remove:function(t){return e.removeSong(t,2)}})))):void 0}}]),n}(o.Component),W=Object(R.a)()(Object(P.a)(B)),J=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(f.a)(n,[{key:"render",value:function(){return o.createElement("section",{className:"section static2 App-subtitle flexcolumn"},o.createElement("h1",null,"Your Ratings"),o.createElement("p",{style:{marginTop:0,fontSize:"80%"}},"Decide which songs make it to the show and which ones don't"))}}]),n}(o.Component),F=n(137),M=n(134),H=n(131),L=n(138),U=n(130),K=n(128),Y=n(133),G=n(129),V=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(f.a)(n,[{key:"render",value:function(){return i.a.createElement("div",{style:{display:"flex",flexDirection:"row",marginBottom:"5px",marginTop:"5px"}},i.a.createElement("div",{style:{height:"100%",display:"flex",justifyContent:"flex-end",flexDirection:"column"}},i.a.createElement(this.props.icon,null)),i.a.createElement("div",{style:{height:"100%",display:"flex",placeItems:"center"}},i.a.createElement(Y.a,{label:this.props.label,value:this.props.value,onChange:this.props.onChange,onKeyDown:this.props.onKeyDown})))}}]),n}(i.a.Component),$=Object(O.a)({root:{height:" 100%",pointerEvents:"all",display:"flex",flexDirection:"column",justifyContent:"space-evenly",alignItems:"center"}})(K.a),q=(Object(O.a)({root:{alignSelf:"center"}})(Y.a),Object(O.a)({root:{alignSelf:"center"}})(G.a)),Q=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={discoverName:"",oldName:""},e.enter=function(t){"Enter"===t.key&&(t.preventDefault(),e.updateSettings())},e.updatePlaylist=function(e,t,n){return fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/users/playlistName?uid=").concat(e,"&playlist=").concat(n,"&playlistName=").concat(t),{method:"put",headers:{"Content-Type":"application/json"}})},e.updateSettings=Object(h.a)(d.a.mark((function t(){var n,a;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:n=JSON.parse(u.a.get("user")),a=n.id,e.updatePlaylist(a,e.state.oldName,"old"),e.updatePlaylist(a,e.state.discoverName,"discover"),e.props.toggleSettings();case 4:case"end":return t.stop()}}),t)}))),e}return Object(f.a)(n,[{key:"componentDidMount",value:function(){var e=Object(h.a)(d.a.mark((function e(){var t,n,a;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=JSON.parse(u.a.get("user")||""),e.next=3,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/users/playlistName?uid=").concat(t.id,"&playlist=discover"));case 3:return e.next=5,e.sent.json();case 5:return n=e.sent,e.next=8,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/users/playlistName?uid=").concat(t.id,"&playlist=old"));case 8:return e.next=10,e.sent.json();case 10:a=e.sent,this.setState({discoverName:n.name||"The Bullpen",oldName:a.name||"Old Flames"});case 12:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this;return o.createElement("div",{style:{width:"480px",minWidth:"480px",justifySelf:"center",alignSelf:"center",zIndex:11,height:"75%",maxHeight:"700px",fontFamily:"Proxima Nova"}},o.createElement($,null,o.createElement("h1",null,"Settings"),o.createElement("div",{style:{height:"95%",width:"95%",borderRadius:"5px",margin:"5%",display:"flex",flexDirection:"column",alignItems:"center"}},o.createElement("div",{style:{height:"95%",width:"95%",border:"1px solid black",borderRadius:"5px",margin:"5%",display:"flex",flexDirection:"column",alignItems:"center"}},o.createElement("div",{style:{display:"flex",flexDirection:"column",flexGrow:1}},o.createElement(V,{onChange:function(t){return e.setState({discoverName:t.target.value})},onKeyDown:this.enter,icon:q,value:this.state.discoverName,label:"Discover Playlist Name"}),o.createElement(V,{onChange:function(t){return e.setState({oldName:t.target.value})},onKeyDown:this.enter,icon:q,value:this.state.oldName,label:"Old Favorites Playlist Name"})),o.createElement("div",{style:{display:"flex",alignSelf:"center",marginBottom:"10px"}},o.createElement(E.a,{variant:"contained",onClick:this.updateSettings},"Save"))))))}}]),n}(o.Component),X=Object(O.a)({root:{zIndex:11,color:"white",border:"1px solid black"}})(T.a),Z=Object(O.a)({root:{color:"#fff",background:"linear-gradient(90deg, rgba(249,249,249,.5) 0%, rgba(146,239,238,.5) 100%)"}})(F.a),ee=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,r=new Array(a),o=0;o<a;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={in:!1},e.toggleSettings=Object(h.a)(d.a.mark((function t(){return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e.setState({in:!e.state.in});case 1:case"end":return t.stop()}}),t)}))),e}return Object(f.a)(n,[{key:"render",value:function(){var e=this,t=this.props.classes;return o.createElement("section",{className:"section parallax bg3 App-subtitle flexcolumn",style:{position:"relative",justifyContent:"space-between"}},o.createElement("h1",{style:{margin:0,flexDirection:"row",display:"flex",justifyContent:"space-between"}},o.createElement("div",{style:{width:"100%"}},"Your Profile "),o.createElement("div",{style:{alignSelf:"flex-end",paddingLeft:10,paddingRight:10}},o.createElement(X,{size:"medium",onClick:this.toggleSettings},o.createElement(U.a,null)))),o.createElement("p",{style:{marginTop:0,fontSize:"80%"}},"Choose settings for your new bullpen playlist."),o.createElement(M.a,{disableAutoFocus:!0,"aria-labelledby":"transition-modal-title","aria-describedby":"transition-modal-description",className:t.modal,open:this.state.in,onClose:function(){return e.setState({in:!1})},closeAfterTransition:!0,BackdropComponent:Z,BackdropProps:{timeout:500}},o.createElement(H.a,{in:this.state.in,direction:"up"},o.createElement(Q,{toggleSettings:this.toggleSettings}))))}}]),n}(o.Component),te=Object(L.a)({modal:{justifyContent:"center",alignItems:"center",display:"flex"}}),ne=Object(O.a)(te)(ee),ae=Object(O.a)({root:{minWidth:"250px",color:"#0",backgroundColor:"#e29670","&:hover":{backgroundColor:"#e29670",filter:"brightness(.8)"},fontWeight:"bold",fontSize:"14px",lineHeight:1,borderRadius:"500px",transitionProperty:"background-color, box-shadow, filter",borderWidth:0,letterSpacing:"2px",whiteSpace:"normal",padding:"16px 14px 18px",fontFamily:"Proxima Nova",alignSelf:"center",marginLeft:"5px",marginRight:"5px"}})(E.a),re=Object(O.a)({root:{color:"black",backgroundColor:"#70e296","&:hover":{backgroundColor:"#70e296"}}})(ae),oe=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){var e;Object(m.a)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={tracks:[],index:0,index1:1,index2:2,size:50,disabled:!1},e.songRefs=o.createRef(),e.refresh=Object(h.a)(d.a.mark((function t(){var n,a,r,o,i,s;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e.setState((function(){return{tracks:[],index:0,index1:1,index2:2,disabled:!1}})),n=e.getDiscover(),t.next=4,Promise.all([n]);case 4:a=t.sent,r=Object(A.a)(a,1),o=r[0],e.setState((function(){return{tracks:o}})),i=new Set,s=new Set,o.forEach((function(e){s.has(e.id)?(console.log(e),i.add(e)):(console.log(e.id),s.add(e.id))})),console.log(s.size),console.log(Array.from(i.values()));case 13:case"end":return t.stop()}}),t)}))),e.handleAddAll=Object(h.a)(d.a.mark((function t(){var n,a,r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=JSON.parse(u.a.get("user")),a=e.state.tracks,r=a.map((function(e){return e.uri})),t.next=5,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/music/discover?uid=").concat(n.id),{method:"put",headers:{"Content-Type":"application/json"},body:JSON.stringify({tracks:r})});case 5:t.sent.ok&&e.setState({index:e.state.tracks.length,index1:e.state.tracks.length,index2:e.state.tracks.length,disabled:!0});case 7:case"end":return t.stop()}}),t)}))),e.getDiscover=Object(h.a)(d.a.mark((function e(){var t,n,a;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=JSON.parse(u.a.get("user")||""),e.next=3,fetch("".concat("http://bullpen.trevorflanigan.com/authorize","/api/music/discover?uid=").concat(t.id,"&length=50"));case 3:return n=e.sent,e.next=6,n.json();case 6:return a=e.sent,e.abrupt("return",a);case 8:case"end":return e.stop()}}),e)}))),e.removeSong=function(){var t=Object(h.a)(d.a.mark((function t(n,a){return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(JSON.parse(u.a.get("user")||"").id){t.next=3;break}return t.abrupt("return");case 3:e.incrementIndex(a),e.setState({tracks:e.state.tracks.slice(a,e.state.tracks.length)});case 5:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),e.heart=function(){var t=Object(h.a)(d.a.mark((function t(n,a){return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(console.log(n),JSON.parse(u.a.get("user")||"").id){t.next=4;break}return t.abrupt("return");case 4:e.incrementIndex(a);case 5:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),e.incrementIndex=function(t){var n=Math.max(e.state.index,e.state.index1,e.state.index2)+1;0==t&&e.setState({index:n}),1==t&&e.setState({index1:n}),2==t&&e.setState({index2:n})},e}return Object(f.a)(n,[{key:"componentDidMount",value:function(){var e=Object(h.a)(d.a.mark((function e(){return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,this.refresh();case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"render",value:function(){var e=this,t=this.props.width,n=Object(R.b)("xl",t),a=Object(R.b)("lg",t);return!this.state.tracks.length||Math.min(this.state.index,this.state.index1,this.state.index2)>=this.state.tracks.length?o.createElement("section",{className:"section static3 App-subtitle flexcolumn",style:{justifyContent:"space-between",height:"100%"}},o.createElement("h1",{style:{margin:0}},"Discover New Songs"),o.createElement("span",{style:{height:"auto",display:"flex",justifyContent:"center"}},o.createElement(ae,{variant:"contained",onClick:this.refresh},"Refresh")),o.createElement("p",null,"We are looking for more songs to suggest! Come back later")):o.createElement("section",{className:"section static3 App-subtitle flexcolumn"},o.createElement("h1",{style:{margin:0}},"Discover New Songs"),o.createElement("span",{style:{height:"auto",display:"flex",justifyContent:"center"}},o.createElement(ae,{disabled:this.state.disabled,variant:"contained",onClick:this.handleAddAll},"Add All ",this.state.tracks.length," Songs"),o.createElement("span",{style:{fontSize:"50px",marginLeft:"5px",marginRight:"5px",alignItems:"center"}}," or "),o.createElement(re,{disabled:this.state.disabled,variant:"contained",onClick:function(e){}},"Make from playlist")),o.createElement("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",flexGrow:1}},o.createElement("div",{className:"parallax songCard"},this.state.tracks.length>0&&o.createElement(I,{track:this.state.tracks[this.state.index],heart:function(t){return e.heart(t,0)},remove:function(t){return e.removeSong(t,0)}})),o.createElement("div",{className:"parallax songCard"},a&&this.state.tracks.length>1&&o.createElement(I,{track:this.state.tracks[this.state.index1],heart:function(t){return e.heart(t,1)},remove:function(t){return e.removeSong(t,1)}})),o.createElement("div",{className:"songCard parallax"},n&&this.state.tracks.length>2&&o.createElement(I,{track:this.state.tracks[this.state.index2],heart:function(t){return e.heart(t,2)},remove:function(t){return e.removeSong(t,2)}}))))}}]),n}(o.Component),ie=Object(R.a)()(Object(P.a)(oe)),se=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(f.a)(n,[{key:"render",value:function(){var e=u.a.get("user")||"{}";return console.log(JSON.parse(e)),o.createElement("div",{className:"wrapper App"},o.createElement("section",{className:"section parallax bg1 flexcolumn"},u.a.get("user")&&o.createElement(j,null),o.createElement("h1",{className:"App-title"},"The Bullpen"),!u.a.get("user")&&o.createElement(N,null)),o.createElement(ie,null),o.createElement(W,null),o.createElement(J,null),o.createElement(ne,null))}}]),n}(o.Component),ce=n(65),le=function(e){Object(g.a)(n,e);var t=Object(b.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(f.a)(n,[{key:"render",value:function(){return o.createElement("div",{className:"wrapper App"},o.createElement("section",{className:"section parallax bg1 flexcolumn"},o.createElement("h1",{className:"App-title"},"The Bullpen"),o.createElement(N,null)),o.createElement("section",{className:"section static1 App-subtitle flexcolumn"},o.createElement("h1",null,"What is the Bullpen?"),o.createElement("p",{style:{marginTop:0,fontSize:"80%"}},"The bullpen is an interface for users to discover, rate, and add new songs to their Spotify libary.")),o.createElement("section",{className:"section parallax bg2 App-subtitle flexcolumn"},o.createElement("h1",null,"Your Suggestions"),o.createElement("p",{style:{marginTop:0,fontSize:"80%"}},"Here you'll find the next songs that you play on repeat!")),o.createElement("section",{className:"section static2 App-subtitle flexcolumn"},o.createElement("h1",null,"Your Ratings"),o.createElement("p",{style:{marginTop:0,fontSize:"80%"}},"Decide which songs make it to the show and which ones don't")),o.createElement("section",{className:"section parallax bg3 App-subtitle flexcolumn"},o.createElement("h1",null,"Your Profile"),o.createElement("p",{style:{marginTop:0,fontSize:"80%"}},"Choose settings for your new bullpen playlist!"),o.createElement(N,null)))}}]),n}(o.Component),ue=n(132),pe=n(66),de=n(139),he={fontFamily:["Spartan","Open Sans","-apple-system","BlinkMacSystemFont",'"Segoe UI"',"Roboto",'"Helvetica Neue"',"Arial","sans-serif",'"Apple Color Emoji"','"Segoe UI Emoji"','"Segoe UI Symbol"'].join(",")},me=Object(pe.a)({palette:{primary:{main:"#000000",contrastText:"#ffffff",light:"#ff3333"},secondary:{main:"#ffffff",contrastText:"#ffffff"},dark:"#ff3333"},typography:he,breakpoints:{values:{xs:0,sm:600,md:1050,lg:1130,xl:1680}},overrides:{}}),fe=me=Object(de.a)(me);var ge=function(){return i.a.createElement(ce.a,null,i.a.createElement(ue.a,{theme:fe},i.a.createElement(x.d,null,i.a.createElement(x.b,{exact:!0,path:"/",component:u.a.get("user")?se:le}),i.a.createElement(x.b,{exact:!0,path:"/authorize",component:w}),i.a.createElement(x.b,{component:se}))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));console.log(Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,REACT_APP_BACKEND_URI:"http://bullpen.trevorflanigan.com/authorize"})),c.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(ge,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[75,1,2]]]);
//# sourceMappingURL=main.81c0a523.chunk.js.map