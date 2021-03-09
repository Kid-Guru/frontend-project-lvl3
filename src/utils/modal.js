import Modal from 'bootstrap/js/dist/modal.js';
// import Modal from './node-modules/bootstrap/js/dist/modal.js';
// import { Modal } from 'bootstrap.esm.min.js';

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
