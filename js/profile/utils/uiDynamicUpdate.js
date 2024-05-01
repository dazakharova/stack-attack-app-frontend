import {Container} from "../../class/Container.js";
import leftContainer from "../collapseFunctionality.js";
import {Item} from "../../class/Item.js";
import {addContainerToPath} from "../locationPathControls.js";
import rightContainer from "../containerRenderHelpers.js";

const updateContentsInLeftMenu = (entityParentId, data) => {
    // Get name of parent name (which is used in its children tags id)
    const parentName = document.getElementById('location-info').lastElementChild.innerText

    // Get parent node for containers in left menu
    const parentNode= document.querySelector(`#${parentName.replace(/\s/g, '')}${entityParentId}-collapse > .containers-list`)

    // Clean areas in parent containers and items node to draw it with updated data
    parentNode.innerHTML = ''

    const parentContainerContents = data.get(parseInt(entityParentId))

    // Rerender each entity inside the parent container of the current item
    if (parentContainerContents) {
        leftContainer.renderContents(parentContainerContents, parentNode, data)
    }
}

const updateContentsInRightContainer = (parentNode, contents, data) => {
    parentNode.innerHTML = ''
    if (contents) {
        contents.forEach(c => {
            if (c instanceof Container) {
                rightContainer.renderContainer(parentNode, c, data)
            } else if (c instanceof Item) {
                rightContainer.renderItem(parentNode, c, data)
            }
        })
    }
}

const renderContainerContents = (event, parentNode, containerContents, containerId, containerName, containerParentId, data) => {
    if (!event.target.matches('#box-dropdown *, .edit-box-icon, .delete-box-icon, .edit-box-icon *, .delete-box-icon *, .ok-button, .title-input')) {
        if (containerContents) {
            // Clean the assets block
            parentNode.innerHTML = ''
            addContainerToPath(containerId, containerName, containerParentId, document.getElementById('location-info'), data)

            containerContents.forEach(c => {
                if (c instanceof Container) {
                    rightContainer.renderContainer(parentNode, c, data)
                } else if (c instanceof Item) {
                    rightContainer.renderItem(parentNode, c, data)
                }
            })
        } else {
            parentNode.innerHTML = ''
            addContainerToPath(containerId, containerName, containerParentId, document.getElementById('location-info'), data)
        }
    }
}

// Function to set up the confirmation modal
function setupConfirmationModal(entityName, confirmCallback) {
    const confirmationModal = document.getElementById('confirmation-modal');
    confirmationModal.style.display = 'block';

    const deleteConfirmationText = document.querySelector('#confirmation-modal .modal-content p');
    deleteConfirmationText.textContent = `Are you sure you want to delete "${entityName}"?`;

    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.onclick = () => {
        confirmationModal.style.display = 'none';
    };

    const confirmBtn = document.getElementById('confirmBtn');
    confirmBtn.onclick = confirmCallback;
    return confirmBtn;  // Return the confirm button if needed outside this function
}

export { updateContentsInLeftMenu, updateContentsInRightContainer, renderContainerContents, setupConfirmationModal }
