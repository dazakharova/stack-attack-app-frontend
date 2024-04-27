import { updateContentsInRightContainer } from './uiDynamicUpdate.js';
import { addContainerToPath } from '../locationPathControls.js';
import { assets } from '../profile.js';

const assetsBlocksDiv = document.querySelector(".space-container")
const currentLocationPathDiv = document.getElementById("location-info")

// Utility to generate unique collapse target id
function generateCollapseTarget(containerName, containerId) {
    return `#${containerName.replace(/\s+/g, '')}${containerId}-collapse`;
}

// Function to create list item for container
function createContainerListItem() {
    return document.createElement('li');
}

// Function to create a button for a container
function createContainerButton(containerId, containerParentId, containerName, collapseTarget) {
    let containerButton = document.createElement('button');
    containerButton.classList.add('btn', 'btn-toggle', 'btn-furniture', 'd-inline-flex', 'align-items-center', 'rounded', 'border-0', 'collapsed');
    containerButton.setAttribute('data-bs-toggle', 'collapse');
    containerButton.setAttribute('data-bs-target', collapseTarget);
    containerButton.setAttribute('aria-expanded', 'false');
    containerButton.setAttribute('data-id', containerId);
    containerButton.setAttribute('data-parentId', containerParentId);
    containerButton.textContent = containerName;
    return containerButton;
}

// Handler for container button click
function handleContainerClick(containerId, containerName, containerParentId, data) {
    addContainerToPath(containerId, containerName, containerParentId, currentLocationPathDiv, data);
    const containerContents = assets.getAssets().get(containerId);
    updateContentsInRightContainer(assetsBlocksDiv, containerContents, assets.getAssets());
}

// Function to create div for child elements
function createChildrenDiv(collapseTarget) {
    const div = document.createElement('div');
    div.className = 'collapse';
    div.setAttribute('id', collapseTarget.substring(1));
    return div;
}

// Function to append elements to their parent nodes
function appendElements(containerLi, containerButton, childrenDiv) {
    containerLi.appendChild(containerButton);
    containerLi.appendChild(childrenDiv);
}

// Function to create a nested list for containers
function createNestedContainersList(collapseTarget) {
    const ul = document.createElement('ul');
    ul.classList.add('containers-list', 'btn-toggle-nav', 'list-unstyled', 'fw-normal', 'pb-1', 'small');
    ul.setAttribute('data-bs-target', collapseTarget);
    return ul;
}

export { generateCollapseTarget, createContainerListItem, createContainerButton, handleContainerClick, createChildrenDiv, appendElements, createNestedContainersList }