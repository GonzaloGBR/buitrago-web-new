/**
 * Script bloqueante en <head>: oculta el chrome de la home antes del primer paint.
 * Si `navigation` aún no existe, igual aplica la clase en `/` (React ajusta después).
 */
export const HOME_ENTRANCE_GUARD_SCRIPT = `(function(){try{var c=location.pathname.replace(/\\/$/,"")||"/";if(c!=="/")return;var n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if(n){if(n.type==="back_forward"||n.type==="prerender")return;var p="/";if(n.name){try{p=new URL(n.name,location.origin).pathname.replace(/\\/$/,"")||"/"}catch(e){}}if(p!=="/")return}document.documentElement.classList.add("home-entrance-pending")}catch(e){}})();`;
