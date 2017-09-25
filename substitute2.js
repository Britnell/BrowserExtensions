/*
 * This file is responsible for performing the logic of replacing
 * all occurrences of each mapped word with its emoji counterpart.
 */

let regex = /[a-zA-Z]+/g

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

 var hyperf_ex = /hyperfeed_story_id_/;
 var testid_ex = /fbfeed_story/;

 function is_hyper( node){
   // little fix, not all nodes have .hasAttribute, so test for nodeType 1
   if( node.nodeType === 1 && node.hasAttribute('data-testid') )  {
     if( testid_ex.test(node.dataset.testid) )  {
       if( hyperf_ex.test(node.id) )  {
         return true;
       }
     }
   }

   return false;
   // Eo find_hyper
 }

 function replaceWithMe (node) {

   if( node.textContent ) {
     let content = node.textContent;

     content = content.replace(regex, "me");

     node.textContent = content;
   }
   // Eo replace
 }

 function hyper_repl_content(hyper){

   entire = child(hyper, [0,0,1,0] );

   if( entire ){
     userContent = child(entire, [1,1,0] );
     if( userContent) {
       //  userContent.className; // == "userContent", _5pbx_userContent
       replaceContent(userContent);
     }
   }

   // Eo hyper_repl_content
 }

function replaceText (node) {
  // Setting textContent on a node removes all of its children and replaces
  // them with a single text node. Since we don't want to alter the DOM aside
  // from substituting text, we only substitute on single text nodes.
  // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent
  if (node.nodeType === Node.TEXT_NODE) {
    // This node only contains text.
    // @see https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType.

    // do NOTHING to text nodes. we do that when looking at the DIV nodes
  }
  else {
    if( is_hyper(node) ){
      // node = a hyper
      hyper_repl_content(node);
      // Eo if
    }

    // This node contains more than just text, call replaceText() on each
    // of its children.
    for (let i = 0; i < node.childNodes.length; i++) {
      replaceText(node.childNodes[i]);
    }
  }
}

// Start the recursion from the body tag.
replaceText(document.body);

// Now monitor the DOM for additions and substitute emoji into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // This DOM change was new nodes being added. Run our substitution
      // algorithm on each newly added node.
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const newNode = mutation.addedNodes[i];
        replaceText(newNode);
      }
    }
  });
});
observer.observe(document.body, {
  childList: true,
  subtree: true
});
