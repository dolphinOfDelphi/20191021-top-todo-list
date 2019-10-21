function Project(name) {
    let _name = name;
    let todos = [];

    return {
        get name() {
            return _name;
        },
        set name(value) {
            _name = value;
        },
        todos
    };
}

const projects = [Project('Default')];
let activeProject = null;

(() => {
    const projectsDiv = document.createElement('div');
    projectsDiv.id = "projects";

    function createProjectDiv(project) {
        const projectDiv = document.createElement('div');
        projectDiv.classList.add('project');
        projectDiv.textContent = project.name;
        projectDiv.addEventListener('click', () => {

            function promptProject() {
                const newName = prompt('New name (blank to delete):', project.name);

                function deleteProject() {
                    projects.splice(projects.indexOf(project), 1);
                    projectsDiv.removeChild(projectDiv);
                }

                function renameProject() {
                    project.name = newName;
                    projectDiv.textContent = newName;
                }

                if (newName) renameProject();
                else if (newName === '') deleteProject();
            }

            function switchProjects() {
                projectsDiv.childNodes.forEach(
                    node => node.classList.remove('active'));
                projectDiv.classList.add('active');
                activeProject = project;
            }

            if (activeProject === project) promptProject();
            else switchProjects();
        });
        return projectDiv;
    }

    const addProjectDiv = document.createElement('div');
    addProjectDiv.id = 'add-project';
    addProjectDiv.classList.add('project');
    addProjectDiv.addEventListener('click', function promptNewProject() {
        const newName = prompt('New project:', '');

        function addNewProject() {
            const project = Project(newName);
            projects.push(project);
            projectsDiv.insertBefore(createProjectDiv(project), addProjectDiv);
        }

        if (newName) addNewProject();
    });
    projectsDiv.appendChild(addProjectDiv);

    for (let project of projects)
        projectsDiv.insertBefore(createProjectDiv(project), addProjectDiv);

    document.getElementById("root").appendChild(projectsDiv);
})();