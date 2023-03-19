!function(){"use strict";var t={9585:function(t,n,r){var e,o=r(9062),a=r(3324),u=r(5322),i=r(4942),c="/",f="/create-manifest",s="/edit-manifest",l="/processing",p="/create-georeference",h="/layers",v="/levels",y="/*",g=(e={},(0,i.Z)(e,c,"home"),(0,i.Z)(e,f,"create"),(0,i.Z)(e,s,"edit"),(0,i.Z)(e,l,"processing"),(0,i.Z)(e,p,"create"),(0,i.Z)(e,h,"create"),(0,i.Z)(e,v,"create"),(0,i.Z)(e,y,"redirect"),.017453292519943295),m=57.29577951308232,d=3.14159265359,M=2*Math.PI;function b(t){if(0===t.length)throw new Error("no polygons provided!");var n=(0,o.Z)(t);if(1===n.length)return x(n[0],n[0]).geometry;for(;n.length>1;){var r=n.shift();try{n[0]=x(n[0],r).geometry}catch(e){}}return n[0]}function x(t,n){var r=(0,u.G0j)(t,n);return r.geometry.coordinates=O(r.geometry.coordinates),r}function Z(t,n,r){var e=t*g,o=function(t,n,r){var e=[],o=[],a=[],u=[],i=t/(1+Math.sqrt(1-t)),c=i/(2-i),f=c;e[0]=c*(2+c*(-2/3+c*(c*(116/45+c*(26/45+c*(-2854/675)))-2))),o[0]=c*(c*(2/3+c*(4/3+c*(-82/45+c*(32/45+c*(4642/4725)))))-2),f*=c,e[1]=f*(7/3+c*(c*(-227/45+c*(2704/315+c*(2323/945)))-1.6)),o[1]=f*(5/3+c*(-16/15+c*(-13/9+c*(904/315+c*(-1522/945))))),f*=c,e[2]=f*(56/15+c*(-136/35+c*(-1262/105+c*(73814/2835)))),o[2]=f*(-26/15+c*(34/21+c*(1.6+c*(-12686/2835)))),f*=c,e[3]=f*(4279/630+c*(-332/35+c*(-399572/14175))),o[3]=f*(1237/630+c*(c*(-24832/14175)-2.4)),f*=c,e[4]=f*(4174/315+c*(-144838/6237)),o[4]=f*(-734/315+c*(109598/31185)),f*=c,e[5]=f*(601676/22275),o[5]=f*(444337/155925),f=Math.pow(c,2);var s=n/(1+c)*(1+f*(1/4+f*(1/64+f/256)));a[0]=c*(c*(2/3+c*(-37/96+c*(1/360+c*(81/512+c*(-96199/604800)))))-.5),u[0]=c*(.5+c*(-2/3+c*(5/16+c*(41/180+c*(-127/288+c*(7891/37800)))))),a[1]=f*(-1/48+c*(-1/15+c*(437/1440+c*(-46/105+c*(1118711/3870720))))),u[1]=f*(13/48+c*(c*(557/1440+c*(281/630+c*(-1983433/1935360)))-.6)),f*=c,a[2]=f*(-17/480+c*(37/840+c*(209/4480+c*(-5569/90720)))),u[2]=f*(61/240+c*(-103/140+c*(15061/26880+c*(167603/181440)))),f*=c,a[3]=f*(-4397/161280+c*(11/504+c*(830251/7257600))),u[3]=f*(49561/161280+c*(-179/168+c*(6601661/7257600))),f*=c,a[4]=f*(-4583/161280+c*(108847/3991680)),u[4]=f*(34729/80640+c*(-3418889/1995840)),f*=c,a[5]=f*(-20648693/638668800),u[5]=.6650675310896665*f;var l=j(o,r),p=-s*(l+function(t,n){var r,e=2*Math.cos(n),o=t.length-1,a=t[o],u=0;for(;--o>=0;)r=e*a-u+t[o],u=a,a=r;return Math.sin(n)*r}(u,2*l));return{Qn:s,Zb:p,cgb:e,utg:a}}(.006694379990141316,1,n*g),a=o.Qn,u=o.Zb,i=o.cgb,c=o.utg,f={x:r[0],y:r[1]};return f=function(t,n,r,e,o,a){var u,i,c=6378137,f=0,s=0,l=(t.x-f)*(1/c),p=(t.y-s)*(1/c);if(p=(p-e)/r,l/=r,Math.abs(l)<=2.623395162778){var h=function(t,n,r){var e,o,a=Math.sin(n),u=Math.cos(n),i=w(r),c=function(t){var n=Math.exp(t);return n=(n+1/n)/2,n}(r),f=2*u*c,s=-2*a*i,l=t.length-1,p=t[l],h=0,v=0,y=0;for(;--l>=0;)e=v,o=h,p=f*(v=p)-e-s*(h=y)+t[l],y=s*v-o+f*h;return[(f=a*c)*p-(s=u*i)*y,f*y+s*p]}(a,2*p,2*l);p+=h[0],l+=h[1],l=Math.atan(w(l));var v=Math.sin(p),y=Math.cos(p),g=Math.sin(l),m=Math.cos(l);p=Math.atan2(v*m,function(t,n){t=Math.abs(t),n=Math.abs(n);var r=Math.max(t,n),e=Math.min(t,n)/(r||1);return r*Math.sqrt(1+Math.pow(e,2))}(g,m*y)),l=Math.atan2(g,m*y),b=l+n,u=Math.abs(b)<=d?b:b-function(t){return t<0?-1:1}(b)*M,i=j(o,p)}else u=1/0,i=1/0;var b;return t.x=u,t.y=i,t}(f,e,a,u,i,c),[P((f={x:f.x*m,y:f.y*m}).x),P(f.y)]}function O(t){return"number"===typeof t?P(t):t.map(O)}function P(t){return parseFloat(t.toFixed(8))}function j(t,n){for(var r,e=2*Math.cos(2*n),o=t.length-1,a=t[o],u=0;--o>=0;)r=e*a-u+t[o],u=a,a=r;return n+r*Math.sin(2*n)}function w(t){var n=Math.exp(t);return n=(n-1/n)/2}self.onmessage=function(t){var n=t.data;try{postMessage(function(t){var n=t.dwgLayers,r=t.polygonLayers,e=t.anchorPoint,o=r.filter((function(t){return n.includes(t.name)}));if(0===o.length)return null;var i=function(t,n){var r=(0,a.Z)(n,2),e=r[0],o=r[1];return t.reduce((function(t,n){return"MultiPolygon"===n.geometry.type?t.multiPolygons.push(function(t,n){var r=(0,a.Z)(n,2),e=r[0],o=r[1];return{type:t.type,coordinates:t.coordinates.map((function(t){return t.map((function(t){return t.map((function(t){var n=(0,a.Z)(t,2),r=n[0],u=n[1];return Z(e,o,[r,u])}))}))}))}}(n.geometry,[e,o])):"Polygon"===n.geometry.type&&t.polygons.push(function(t,n){var r=(0,a.Z)(n,2),e=r[0],o=r[1];return{type:t.type,coordinates:t.coordinates.map((function(t){return t.map((function(t){var n=(0,a.Z)(t,2),r=n[0],u=n[1];return Z(e,o,[r,u])}))}))}}(n.geometry,[e,o])),t}),{multiPolygons:[],polygons:[]})}(o,e.coordinates),c=function(t){var n=(0,u.uf4)(t.map((function(t){return(0,u.yue)(t.coordinates)})));return(0,u.$e4)(n).features.map((function(t){return t.geometry}))}(i.polygons);return[b(i.multiPolygons.concat(c)),e]}(n))}catch(r){}}}},n={};function r(e){var o=n[e];if(void 0!==o)return o.exports;var a=n[e]={exports:{}};return t[e].call(a.exports,a,a.exports,r),a.exports}r.m=t,r.x=function(){var t=r.O(void 0,[845],(function(){return r(9585)}));return t=r.O(t)},function(){var t=[];r.O=function(n,e,o,a){if(!e){var u=1/0;for(s=0;s<t.length;s++){e=t[s][0],o=t[s][1],a=t[s][2];for(var i=!0,c=0;c<e.length;c++)(!1&a||u>=a)&&Object.keys(r.O).every((function(t){return r.O[t](e[c])}))?e.splice(c--,1):(i=!1,a<u&&(u=a));if(i){t.splice(s--,1);var f=o();void 0!==f&&(n=f)}}return n}a=a||0;for(var s=t.length;s>0&&t[s-1][2]>a;s--)t[s]=t[s-1];t[s]=[e,o,a]}}(),r.d=function(t,n){for(var e in n)r.o(n,e)&&!r.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:n[e]})},r.f={},r.e=function(t){return Promise.all(Object.keys(r.f).reduce((function(n,e){return r.f[e](t,n),n}),[]))},r.u=function(t){return"static/js/"+t+".acb838ff.chunk.js"},r.miniCssF=function(t){},r.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},r.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.p="/azure-maps-creator-onboarding-tool/",function(){var t={585:1};r.f.i=function(n,e){t[n]||importScripts(r.p+r.u(n))};var n=self.webpackChunkmanifest_tool=self.webpackChunkmanifest_tool||[],e=n.push.bind(n);n.push=function(n){var o=n[0],a=n[1],u=n[2];for(var i in a)r.o(a,i)&&(r.m[i]=a[i]);for(u&&u(r);o.length;)t[o.pop()]=1;e(n)}}(),function(){var t=r.x;r.x=function(){return r.e(845).then(t)}}();r.x()}();
//# sourceMappingURL=585.508e2029.chunk.js.map