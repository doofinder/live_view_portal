import {
  maybe
} from "./utils"

import DOM from "./dom"

export default class DOMPostMorphRestorer {
  // lvp:comment-next-line
  // constructor(containerBefore, containerAfter, updateType){
  // lvp:add-next-line
  constructor(containerBefore, containerAfter, updateType, domRoot){
    let idsBefore = new Set()
    let idsAfter = new Set([...containerAfter.children].map(child => child.id))

    let elementsToModify = []

    Array.from(containerBefore.children).forEach(child => {
      if(child.id){ // all of our children should be elements with ids
        idsBefore.add(child.id)
        if(idsAfter.has(child.id)){
          let previousElementId = child.previousElementSibling && child.previousElementSibling.id
          elementsToModify.push({elementId: child.id, previousElementId: previousElementId})
        }
      }
    })

    // lvp:add-next-line
    this.domRoot = domRoot || document
    this.containerId = containerAfter.id
    this.updateType = updateType
    this.elementsToModify = elementsToModify
    this.elementIdsToAdd = [...idsAfter].filter(id => !idsBefore.has(id))
  }

  // We do the following to optimize append/prepend operations:
  //   1) Track ids of modified elements & of new elements
  //   2) All the modified elements are put back in the correct position in the DOM tree
  //      by storing the id of their previous sibling
  //   3) New elements are going to be put in the right place by morphdom during append.
  //      For prepend, we move them to the first position in the container
  perform(){
    // lvp:comment-next-line
    // let container = DOM.byId(this.containerId)
    // lvp:add-next-line
    let container = DOM.byId(this.containerId, this.domRoot)
    this.elementsToModify.forEach(elementToModify => {
      if(elementToModify.previousElementId){
      // lvp:comment-start
      // maybe(document.getElementById(elementToModify.previousElementId), previousElem => {
      //   maybe(document.getElementById(elementToModify.elementId), elem => {
      // lvp:comment-end
      // lvp:block-start
        maybe(this.domRoot.getElementById(elementToModify.previousElementId), previousElem => {
          maybe(this.domRoot.getElementById(elementToModify.elementId), elem => {
            // lvp:block-end
            let isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id
            if(!isInRightPlace){
              previousElem.insertAdjacentElement("afterend", elem)
            }
          })
        })
      } else {
        // This is the first element in the container
        // lvp:comment-next-line
        // maybe(document.getElementById(elementToModify.elementId), elem => {
        // lvp:add-next-line
        maybe(this.domRoot.getElementById(elementToModify.elementId), elem => {
          let isInRightPlace = elem.previousElementSibling == null
          if(!isInRightPlace){
            container.insertAdjacentElement("afterbegin", elem)
          }
        })
      }
    })

    if(this.updateType == "prepend"){
      this.elementIdsToAdd.reverse().forEach(elemId => {
        // lvp:comment-next-line
        // maybe(document.getElementById(elemId), elem => container.insertAdjacentElement("afterbegin", elem))
        // lvp:add-next-line
        maybe(this.domRoot.getElementById(elemId), elem => container.insertAdjacentElement("afterbegin", elem))
      })
    }
  }
}
