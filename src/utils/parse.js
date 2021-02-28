const domparser = new DOMParser();

export default (rawData, feedID) => {
  const docXML = domparser.parseFromString(rawData, 'text/xml');
  // console.log(docXML)
  const channelNode = docXML.querySelector('channel');
  const itemNodes = docXML.querySelectorAll('item');
  const channelTitleNode = channelNode.querySelector('title');
  const channelDescriptionNode = channelNode.querySelector('description');
  const channelLinkNode = channelNode.querySelector('link');

  const channelTitle = channelTitleNode.textContent;
  const channelDescription = channelDescriptionNode.textContent;
  const channelLink = channelLinkNode.textContent;
  const items = Array.from(itemNodes).map((itemNode) => {
    const title = itemNode.querySelector('title').textContent;
    const link = itemNode.querySelector('link').textContent;
    const description = itemNode.querySelector('description').textContent;
    const id = itemNode.querySelector('guid').textContent;
    return {
      title, link, description, feedID, id, touched: false,
    };
  });

  return {
    feed: {
      channelTitle,
      channelDescription,
      channelLink,
    },
    posts: items,
  };
};
