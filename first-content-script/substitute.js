/*
 * This file is responsible for performing the logic of replacing
 * all occurrences of each mapped word with its emoji counterpart.
 */

/**
 * Substitutes emojis into text nodes.
 * If the node contains more than just text (ex: it has child nodes),
 * call replaceText() on each of its children.
 *
 * @param  {Node} node    - The target DOM Node.
 * @return {void}         - Note: the emoji substitution is done inline.
 */



 function child( node, Lis){
   //initial_node = node;

   if(  node.hasChildNodes() ) {    // DD node.nodeType === 1 &&

     for( n=0; n< Lis.length; n++) {
       // if has that child
       if(node.hasChildNodes() )
       {
           // if child in range
           if( node.childNodes.length >Lis[n] ) {
             node = node.childNodes[ Lis[n] ];
           }
           else
           {
              return false;
           }
       }
       else
       {
         return false;
       }

     } // Eo for

     return node;
   }
   else   // if does not have children
   {
      return false;
   }
 }


 function is_empty(node){
   return child(is_empty,[0]);
 }

 //   #   ]#    #   Reg Ex
//    #
//    #

var post_RE = /_5pbx userContent/;
function is_post(node){

  if( post_RE.test(node.className) )  {
    return true;
  }

  return false;
}

//var comment_RE = /_3b-9/;
var comment_RE = /UFICommentBody/;

function is_comment(node){

  if( comment_RE.test(node.className) )  {
    return true;
  }

  return false;
}

// #
var desription_RE = /((_5pco)|(_5pcm)|(_6m7)|(mbs _5pbx))/;

function is_description(node){
  if( desription_RE.test(node.className) )  {
    return true;
  }

  return false;
}


//    #   #   #   #   #       Replace Me
//    #
//    #


function string_me( notme){
  var newme = 'M';

  if(notme.length >2){
    for( x=1; x<notme.length; x++){
      newme += 'e';
    }
  }
  else{
    if(notme.length>1){
      newme = 'me';
    }
    else{
      newme = 'm-';
    }
  }
  return newme;
}
// #

function text_me( notme){
    spliz = notme.split(" ");

    for(w=0; w<spliz.length; w++){
      spliz[w] = string_me(spliz[w]);
    }
    return spliz.join(" ");
}

function content_me( nodeme){
      newmsg = text_me(nodeme.textContent);
      nodeme.textContent = newmsg;
}

function node_me( node){
  if( node.nodeType === Node.TEXT_NODE)
  {
      content_me(node);
        // do something here to end - text nodes
  } // Eo if nodetype
  else {

    for (let i = 0; i < node.childNodes.length; i++) {
      node_me(node.childNodes[i]);
    } // Eo for
     // Eo if
  }


} // Eo function

 //   #   #   #   #   #

 function loopNodes(node) {
     // each node
     // if its a hyperfeed_xyz then replace.
     if( node.nodeType === Node.TEXT_NODE)
     {

           // do something here to end - text nodes
     } // Eo if nodetype
     else {

       //console.log( node.nodeType, node);
       if( is_post(node) ){
         //console.log("post:",node);
         node_me(node);
       }
       if( is_comment(node) ){
         //console.log("commt:",node);
         node_me(node);
       }
       if(is_description(node) ){
         console.log(node);
         node_me(node);
       }

       for (let i = 0; i < node.childNodes.length; i++) {
         loopNodes(node.childNodes[i]);
       } // Eo for
        // Eo if
     }

     // Eo loopHyperfeed
 }


 // Start the recursion from the body tag.
 loopNodes(document.body);



// Now monitor the DOM for additions and substitute emoji into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // This DOM change was new nodes being added. Run our substitution
      // algorithm on each newly added node.
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const newNode = mutation.addedNodes[i];
        loopNodes(newNode);
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
