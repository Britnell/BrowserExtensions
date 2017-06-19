// finding facebook post content with javascript
// notes from running in console


function child( node, Lis){
  //initial_node = node;

  if( node.nodeType === 1 && node.hasChildNodes() ) {

    for( n=0; n< Lis.length; n++) {
      // if has that child
      if( node.childNodes.length >Lis[n] ) {
        node = node.childNodes[ Lis[n] ];
      }
      else {
        return false;
      }

    } // Eo for

    return node;
  }
  else {
    return false;
  }
}

var hyperfeed_RE = /hyperfeed_story_id_/;
var testid_RE = /fbfeed_story/;
var substream_RE = /substream/;
var comments_RE = /UFIList/;
var comment_RE = /UFICommentContent/;

function is_post_related( node){

  // little fix, not all nodes have .hasAttribute, so test for nodeType 1
  if( node.nodeType === 1 && node.hasAttribute('data-testid') )  {
    if( testid_RE.test(node.dataset.testid) )  {
      return true;
    }
  }
  if( hyperfeed_RE.test(node.id) )  {
    return true;
  }
  if( substream_RE.test(node.id)){
    return true;
  }

  return false;
  // Eo find_hyper
}

function is_hyperfeed( node){

  // little fix, not all nodes have .hasAttribute, so test for nodeType 1
  if( hyperfeed_RE.test(node.id) )  {
    return true;
  }

  return false;
  // Eo find_hyper
}


function is_comment( node){

  // little fix, not all nodes have .hasAttribute, so test for nodeType 1
  if( comments_RE.test(node.className) )  {
    return true;
  }

  return false;
  // Eo find_hyper
}

function get_entire(hyper){
  //return hyper.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
  return child(hyper, [0,0,1,0] );
}

function get_comments( hyper) {
  UFIList = child( hyper, [0,0,1,1,0,4,0]);
  //    ? UFIList.className // "UFILIST"
  //UFIList = child(UFIList, [2,0]);

  return UFIList;
  // Comment text is :
  // <span class="UFICommentBody"><span> Mememe</span></span
}

function get_user_did(hyper) {
  about_post = child(hyper, [0,0,1,0,1,2,1,0,1]);
  // post : child(about_post, [0]);
  post = child(about_post, [0,0,1]);
  // comments :
  comments = child(about_post, [1,0]);

  return about_post;
}

function get_suggested_page(hyperf){
    // child(hyperf,[0,0,0,0]);   // "Suggested Page"
    suggested = child(hyperf,[0,0,0,1]);

    sugg_header = child(hyperf,[0,0,0,1,0]);    // Heading/title
    sugg_content = child(hyperf,[0,0,0,1,1,0]);    // suggested text1
    sugg_attach = child(hyperf,[0,0,0,1,1,1]);

    return suggested;
}


function hyper_repl_content(hyper){
  //    hyper.textContent;    // all text
  //    hyper.dataset.testid;   // "fbfeed_story"
  entire = get_entire(hyper);

  // entire[0]
  //header = child(entire, [1,0]);

  /// entire[1]
  userContent = child(entire, [1,1] );
  //  userContent.className; // == "userContent", _5pbx_userContent
  userContent = child(userContent, [0] );
  if(userContent){
    replaceContent(userContent);
  }
  // Eo hyper_repl_content
}

function hyper_print(hyper){
    console.log("hyper:", hyper);

    entire = get_entire(hyper);
    console.log("entire:",entire);
    // advertisings are inside entire

    postText = child(entire, [1,1]);   // class "_5pdx_userContent"
    console.log("post-text:",postText);
    postObject = child(entire, [1,2]);
    console.log("post-object:",postObject);

    comments = get_comments(hyper);
    console.log("comments;", comments);

    postAttachment = child(postObject,[1,0,1,0]);
    console.log("attachment:",postAttachment);

    user_did_post = get_user_did(hyper);
    console.log("user did X:",user_did_post);

    suggested = get_suggested_page(hyper);
    console.log("suggested:", suggested);

    Attachment_header = child(postAttachment,[0,0]);
    Attachment_content = child(postAttachment, [0,1]);
    Attachment_media = child(postAttachment,[0,2]);

    //shared_comments = postContent.childNodes[1].childNodes[0].childNodes[1].childNodes[1];
    //shared_comments_form = shared_comments.childNodes[0];

    // for X likes Page
    // text = "X likes Y Page"
    // shared page not there
}

function loopNodes(node) {
    // each node
    // if its a hyperfeed_xyz then replace.
    if( node.nodeType === Node.TEXT_NODE)
    {

          // do something here to end - text nodes
    } // Eo if nodetype
    else {

      // do something here to div / Type 1
      //if( is_post_related(node) ){console.log(node)}

      if( is_hyperfeed(node) ){
        hyper_print(node);

      }

      for (let i = 0; i < node.childNodes.length; i++) {
        loopNodes(node.childNodes[i]);
      } // Eo for
       // Eo if
    }
    // Eo loopHyperfeed
}
loopNodes(document.body);

///var hyperf_ex2 = /UFICommentBody/;


function loopComments(node) {
  if( node.nodeType === Node.TEXT_NODE)
  {

  } // Eo if
  else
  {
    if( comment_RE.test(node.className)  ) {
      // if class is right, this looks good.
      // node = commentcontent.
      // 1. try just changing all text
      loopCommentContent(node);
    }
    else
    {
      for (let i = 0; i < node.childNodes.length; i++) {
        loopComments(node.childNodes[i]);
      }
    }

  }

} // Eo loopComments

function loopCommentContent(node) {
  if( node.nodeType === Node.TEXT_NODE)
  {
      replaceContent(node );
  } // Eo if
  else
  {
      // loop through divs, replace text at the ends
      for (let i = 0; i < node.childNodes.length; i++) {
        loopCommentContent(node.childNodes[i]);
      }

  }

} // Eo loopComments





//
function get_feed() {
  pagelet = document.getElementById('stream_pagelet');
  feed = child(pagelet, [4,0,1] );
  return feed;
}

// get top posts
function substream_get_hyperfeed(substream){
  //hyperfeed = substream.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
  hyperfeed = child(substream, [0,0,0,0] );
  return hyperfeed;
}

function is_substream( node){

  // little fix, not all nodes have .hasAttribute, so test for nodeType 1
  if( substream_RE.test(node.id)){
    return true;
  }

  return false;
  // Eo find_hyper
}

function hyper_structure(hyper){
  //    hyper.textContent;    // all text
  //    hyper.dataset.testid;   // "fbfeed_story"
  entire = hyper.childNodes[0].childNodes[0].childNodes[1].childNodes[0];

  // entire[0]
  header = entire.childNodes[1].childNodes[0];

  /// entire[1]
  userContent = entire.childNodes[1].childNodes[1];
  //  userContent.className; // == "userContent", _5pbx_userContent
  userContent = userContent.childNodes[0];
  //---replaceContent(userContent)
}


regex = /[a-zA-Z]+/g;

function replaceContent (node) {

  if( node.textContent ) {
    let content = node.textContent;

    content = content.replace(regex, "me");

    node.textContent = content;
  }
  // Eo replace
}


function loopHyperfeed(node) {
    // each node
    // if its a hyperfeed_xyz then replace.
    if( node.nodeType === Node.TEXT_NODE)
    {
          // we dont actually do anything to text nodes
    } // Eo if nodetype
    else {
      if( is_hyper(node) ){
        // node = a hyper
        hyper_repl_content(node);
        // Eo if
      }


      for (let i = 0; i < node.childNodes.length; i++) {
        loopHyperfeed(node.childNodes[i]);
      } // Eo for
       // Eo if
    }
    // Eo loopHyperfeed
}
/*
feed = get_feed();
sub0 = feed.childNodes[0];
sub1 = feed.childNodes[1];
more = feed.childNodes[2];

hyp0 = substream_get_hyperfeed(sub0);
hyp1 = substream_get_hyperfeed(sub1);

hyper_print(hyp0);
hyper_print(hyp1);
*/

// #    #   #   #   #   #
//  #   #
//   #      Trigger
//  #




function ex_replaceText(node) {
  var FedEx = /[a-zA-Z]+g/;

	if( node.nodeType === Node.TEXT_NODE)
	{
        let content = node.textContent;
        content = content.replace(FedEx, "me");
        node.textContent=content;
	}
	else {
		for( let i=0; i<node.childNodes.length; i++){
			replaceText(node.childNodes[i] );
        }
    }

}

// #
