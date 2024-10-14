function getTextDensity(element: HTMLElement): number {
  const textContent = element.textContent?.trim() || '';
  const tagCount = element.querySelectorAll('*').length;
  const textLength = textContent.length;

  return textLength / (Math.max(tagCount, 1) + 0.5); // Avoid dividing by 0
}

function isIrrelevant(element: ChildNode): boolean {
  const irrelevantTags = [
    'nav',
    'footer',
    'aside',
    'form',
    'cite',
    'link',
    'button',
    'mark',
    'code',
    'pre',
    'head',
    'html',
    'a',
    'body',
    'style',
    'img',
    'label',
    'input',
    'select',
    'option',
    'svg',
    'path',
    'iframe',
    'script',
    'checkbox',
  ];

  const irrelevantClasses = [
    'sidebar',
    'footer',
    'ad',
    'nav',
    'popup',
    'promo',
    'promoted',
    'username',
    'profile',
    'comment',
    'banner',
    'cookie',
    'disclaimer',
    'ad',
    'ads',
    'advert',
    'advertisement',
    'ad-banner',
    'ad-container',
    'adslot',
    'ad-footer',
    'ad-sidebar',
    'sponsored',
    'sponsor',
    'promoted',
    'promos',
    'popup',
    'modal',
    'overlay',
    'cookie-banner',
    'cookie-consent',
    'notification',
    'alert',
    'subscribe-popup',
    'signup-popup',
    'newsletter',
    'newsletter-signup',
    'announcement',
    'sidebar',
    'widget',
    'sidebar-widget',
    'related-posts',
    'related-links',
    'related-articles',
    'recommended',
    'trending',
    'sticky',
    'right-sidebar',
    'left-sidebar',
    'floating-banner',
    'megamenu',
    'footer',
    'site-footer',
    'footer-links',
    'footer-widgets',
    'footer-nav',
    'nav',
    'navigation',
    'navbar',
    'breadcrumb',
    'pagination',
    'page-navigation',
    'skip-to-content',
    'social',
    'social-media',
    'social-links',
    'social-share',
    'share-buttons',
    'comment',
    'comments-section',
    'login',
    'login-popup',
    'signup',
    'form-container',
    'form-footer',
    'header',
    'header-banner',
    'banner',
    'search-bar',
    'hero-banner',
    'disclaimer',
    'cookie',
    'cookie-disclaimer',
  ];

  const irrelevantIds = ['sidebar', 'footer', 'ad', 'nav', 'popup', 'cookie', 'disclaimer'];

  const tagName = element.nodeName.toLowerCase();

  return irrelevantTags.includes(tagName);
}

function getTagPriority(element: HTMLElement): Boolean {
  const tagName = element.tagName.toLowerCase();
  // const tagPriority: Record<string, number> = {
  //   h1: 1,
  //   h2: 1,
  //   h3: 1,
  //   article: 0,
  //   section: 0,
  //   header: 0,
  //   p: 2,
  //   div: 0,
  //   span: 0, // Lower span priority to avoid irrelevant selections
  //   b: 0,
  // };
  if (tagName == 'p') {
    return true;
  }
  return false;
}

function extractImportantElements(element: HTMLElement, relevantElements: ChildNode[], minDensity: number = 5) {
  console.log(element.tagName.toLowerCase());

  // const density = getTextDensity(element);
  // const textLength = element.textContent?.trim().length || 0;

  // const minTextLength = 20; // Minimum text length for relevance
  // const tagPriority = getTagPriority(element);

  function allDescendants(node: ChildNode) {
    for (var i = 0; i < node.childNodes.length; i++) {
      var child = node.childNodes[i];
      if (isIrrelevant(child)) {
        continue; // Stop processing this element and its children
      }
      if (child.nodeName.toLowerCase() == 'p') {
        relevantElements.push(child);
      }
      allDescendants(child);
    }
  }
  allDescendants(element);

  // // Adjust the condition for selecting relevant elements
  // if (textLength > minTextLength || tagPriority) {
  //   // if (element.tagName.toLowerCase() == 'p') {
  //   //   let p_content = element.innerText;
  //   //   if (p_content.length > 20) {
  //   relevantElements.push(element);
  //   //   }
  //   // }
  // } else {
  //   Array.from(element.children).forEach((child: Element) => {
  //     extractImportantElements(child as HTMLElement, relevantElements, minDensity);
  //   });
  // }
}

export function extractContentFromPage(): HTMLElement[] {
  const relevantElements: HTMLElement[] = [];

  const relevantSelectors = ['main'];

  relevantSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      extractImportantElements(element as HTMLElement, relevantElements);
    });
  });

  console.log(relevantElements);
  return relevantElements;
}
