// eslint-disable-next-line import/no-unresolved
import Modal from 'bootstrap/js/dist/Modal';

export default class {
  constructor(IdRootElem) {
    this.rootElem = document.getElementById(IdRootElem);
    this.modalTitle = this.rootElem.querySelector('.modal-title');
    this.modalBody = this.rootElem.querySelector('.modal-body');
    this.linkToFullArticle = this.rootElem.querySelector('.full-article');
    this.bsModal = new Modal(this.rootElem);
  }

  show(postData) {
    this.modalBody.textContent = postData.description;
    this.modalTitle.textContent = postData.title;
    this.linkToFullArticle.setAttribute('href', postData.link);
    this.bsModal.show();
  }
}
