type File = { id: string; name: string };
type Folder = {
    id: string;
    name: string;
    files: File[];
};
type Position = {
    sourceFolderId: number;
    destinationFolderId: number; 
    fileId: number;
};

  function isPresenceError(list: Folder[], sourceId: string, destinationId: string): never {
    if(list === []) throw new Error("This resource cannot be empty")
    const sourceFolderid = list.findIndex(folder => folder.id === sourceId)
    if (sourceFolderid !== -1) throw new Error("You cannot move a folder")
    const destinationFileid = list.findIndex(folder => folder.files.some(file => file.id === destinationId))
      if (destinationFileid !== -1) throw new Error("You cannot specify a file as the destination")
      throw new Error("This resource cannot be empty")
  }

  function findPositions(list: Folder[], sourceId: string, destinationId: string): Position {
    // finding source folder id i.e any folder that has the file inside)
    const sourceFolderId = list.findIndex(fld => fld.files.some(file => file.id === sourceId))
    //finding destination folder position
    const destinationFolderId = list.findIndex(fld => fld.id === destinationId)
    //if any search fails throw Presence error
    if (sourceFolderId === -1 || destinationFolderId === -1) isPresenceError(list, sourceId, destinationId)
    // finding file id inside the source folder
    const fileId = list[sourceFolderId].files.findIndex(file => file.id === sourceId)
    // returning all positions
    return {sourceFolderId, destinationFolderId, fileId}
}
export default function move(list: Folder[], source: string, destination: string): Folder[] {
    const result = [...list];
    //find ids of source and destination folder inside list
    const {sourceFolderId, destinationFolderId, fileId} = findPositions(list, source, destination)
    //move file out of source folder and store in temp
    const file = result[sourceFolderId].files.splice(fileId, 1)[0]
    //move file to destination folder
    result[destinationFolderId].files.push(file)
    return result
}

  