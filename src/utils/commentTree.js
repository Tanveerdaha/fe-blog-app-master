export const buildCommentTree = (comments) => {
    const map = {};
    const roots = [];

    comments.forEach((comment) => {
        map[comment._id] = { ...comment, replies: [] };
    });

    comments.forEach((comment) => {
        if (comment.parentId && map[comment.parentId]) {
            map[comment.parentId].replies.push(map[comment._id]);
        } else if (!comment.parentId) {
            roots.push(map[comment._id]);
        }
    });

    return roots;
};
