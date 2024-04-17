import { addContainerToPath } from "./locationPath.js";
import {Container} from "../class/Container.js";
import {Item} from "../class/Item.js";
import leftContainer from "./collapseFunctionality.js";
import {assets} from "./profile.js";

const renderContainer = (parentNode, container, data) => {
    const containerId = container.getId()
    const containerParentId = container.getParentId()
    const containerName = container.getName()

    // Create block for container
    const containerDiv = document.createElement('div')
    containerDiv.className = 'box'

    const containerContents = data.get(container.getId())

    // Create container footer
    const containerFooter = document.createElement('div')
    containerFooter.className = 'box-footer'

    // Create span for container with its title inside
    const containerSpan = document.createElement('span')
    containerSpan.className = 'title'

    // Set attributes holding its unique information in order to be able to access them later
    containerSpan.setAttribute('data-id', containerId)
    containerSpan.setAttribute('data-parentId', containerParentId)
    containerSpan.innerText = containerName

    // Create edit icon
    const editIcon = document.createElement('i')
    editIcon.classList.add('bi', 'bi-pencil-square', 'edit-box-icon')

    // Create delete icon
    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('bi', 'bi-trash', 'delete-box-icon')

    containerDiv.addEventListener('click', (event) => {
        if (!event.target.matches('.edit-box-icon, .delete-box-icon, .edit-box-icon *, .delete-box-icon *, .ok-button, .title-input')) {
            if (containerContents) {
                // Clean the assets block
                parentNode.innerHTML = ''
                addContainerToPath(containerSpan, document.getElementById('location-info'), data)

                containerContents.forEach(c => {
                    if (c instanceof Container) {
                        renderContainer(parentNode, c, data)
                    } else if (c instanceof Item) {
                        renderItem(parentNode, c, data)
                    }
                })
            } else {
                parentNode.innerHTML = ''
                addContainerToPath(containerSpan, document.getElementById('location-info'), data)
            }
        }
    })

    editIcon.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = containerSpan.textContent;
        input.classList.add('title-input');
        containerFooter.replaceChild(input, containerSpan)

        // Replace edit icon with 'OK' button
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.classList.add('ok-button'); // For styling, if needed
        containerFooter.replaceChild(okButton, editIcon);

        // Focus on the input and select its content
        input.focus();
        input.select();

        okButton.addEventListener('click', async function() {
            // Get parent name from the location path
            const parentName = document.getElementById('location-info').lastElementChild.innerText

            // Get parent node in the left collapse menu in order to update container name there
            const parentNode = document.querySelector(`#${parentName.replace(/\s/g, '')}${containerParentId}-collapse`)

            try {
                containerSpan.textContent = input.value;
                containerFooter.replaceChild(containerSpan, input);

                const response = await assets.editContainerName(containerId, input.value)

                // Rerender left container with updated container name
                parentNode.innerHTML = ''
                data.get(parseInt(containerParentId)).forEach(c => {
                    if (c instanceof Container) {
                        leftContainer.renderContainer(parentNode, c, data)
                    } else if (c instanceof Item) {
                        leftContainer.renderItem(parentNode, c, data)
                    }
                })

                containerFooter.replaceChild(editIcon, okButton);
            } catch (error) {
                console.error(error)
            }
        });

        // Add event listener for Enter key
        input.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter') {const newSpan = document.createElement('span');
                try {
                    containerSpan.textContent = input.value;
                    containerFooter.replaceChild(containerSpan, input)

                    const response = await assets.editContainerName(containerId, input.value)

                    containerFooter.replaceChild(editIcon, okButton);
                } catch (error) {
                    console.error(error)
                }
            }
        })
    })

    deleteIcon.addEventListener('click', async (event) => {
        const isConfirmed = confirm(`Are you sure you want to delete "${containerName}"?`);

        if (isConfirmed) {
            try {
                const response = await assets.removeContainer(containerId)

                // Prevent the event from bubbling up to the room button click listener
                event.stopPropagation();

                parentNode.removeChild(containerDiv)
            } catch (error) {
                console.error(error)
            }
        }
    })

    containerFooter.appendChild(containerSpan)
    containerFooter.appendChild(editIcon)
    containerFooter.appendChild(deleteIcon)

    // Append span to div
    containerDiv.appendChild(containerFooter)

    // Append div to parent node given as an argument
    parentNode.appendChild(containerDiv)
}


const renderItem = (parentNode, item, data) => {
    // Create div for item
    const itemDiv = document.createElement('div')
    itemDiv.className = 'item'

    // Add event listener to item div, once it's clicked - popup window with detailed info about the item shows up
    itemDiv.addEventListener('click', () => {
        // Get the modal window
        let modal = document.getElementById("modal")

        // Get the elements of the modal window after opening it
        let modalImage = document.getElementById("modal-image");
        let modalTitle = document.getElementById("modal-title");
        let modalDescription = document.getElementById("modal-description");

        // Set the data in the modal window
        modalTitle.textContent = item.getName();
        // modalImage.src = image;
        modalDescription.textContent = item.getDescription();

        // Display the modal window
        modal.style.display = "block";

        // Close the modal window when the close button is clicked
        let closeButton = document.querySelector(".close");
        if (closeButton) {
            closeButton.onclick = function () {
                modal.style.display = "none";
            };
        }
    })



    // Create img for item
    const itemImg = document.createElement('img')

    // Create span for item with its title
    const itemSpan = document.createElement('span')
    itemSpan.className = 'title'
    itemSpan.innerText = item.getName()

    // Set attributes holding unique information about an item in order to be able to access them later
    itemSpan.setAttribute('data-id', item.getId())
    itemSpan.setAttribute('data-containerId', item.getContainerId())

    // Append item image and span to the item div
    itemDiv.appendChild(itemImg)
    itemDiv.appendChild(itemSpan)

    // Append item div to parent node given as an argument
    parentNode.appendChild(itemDiv)
}

const rightContainer = {
    renderContainer,
    renderItem
}

export default rightContainer