const nb = require(`notebookjs`);

const unstable_shouldOnCreateNode = ({ node }) => {
  // Bypassing/Filtering out the files that are not of .ipynb extension  and removing notebook checkpoints file.
  return (
    node.extension !== `ipynb` ||
    String(node.absolutePath).includes(`.ipynb_checkpoints`)
  );
};

const getChildNode = ({ node, content }) => {
  const nodeData = {
    title: 'Shaurya Notebook',
    description: '',
  };

  // creating the notebook note with content internal type "JupyterNoteook"
  const notebookNode = {
    ...nodeData,
    id: `${node.id} >>> JupyterNotebook`,
    children: [],
    parent: node.id,
    internal: {
      content: content,
      type: `JupyterNotebook`,
    },
  };

  notebookNode.json = JSON.parse(content);
  notebookNode.metadata = notebookNode.json.metadata;

  // parsing json data to html content using notebookjs
  // (https://www.npmjs.com/package/notebookjs)
  notebookNode.html = nb.parse(notebookNode.json);

  if (node.internal.type === `File`) {
    notebookNode.fileAbsolutePath = node.absolutePath;
  }

  return notebookNode;
};

const onCreateNode = async ({ node, loadNodeContent, actions }) => {
  const { createNode, createParentChildLink } = actions;

  if (!unstable_shouldOnCreateNode({ node })) return;

  const content = await loadNodeContent(node);

  const notebookChildNode = getChildNode({ node, content });

  createNode(notebookChildNode);
  createParentChildLink({
    parent: node,
    child: notebookChildNode,
    name: `jupyter___NODE`,
  });
};

exports.unstable_shouldOnCreateNode = unstable_shouldOnCreateNode;
exports.onCreateNode = onCreateNode;
