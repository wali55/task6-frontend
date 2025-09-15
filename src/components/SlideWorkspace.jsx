import { useSelector } from 'react-redux';

const SlideWorkspace = () => {
  const { selectedSlide, activeUsers } = useSelector(state => state.presentation);
  const {userId} = useSelector(state => state.user);
  
  const currentUser = activeUsers.find(user => user.userId === userId);
  const canEdit = currentUser?.role === 'CREATOR' || currentUser?.role === 'EDITOR';

  if (!selectedSlide) {
    return (
      <div className="flex-1 bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl text-gray-400 mb-4">📄</div>
          <p className="text-gray-500">No slide selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg aspect-video p-8 relative">
          {!canEdit && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-gray-200 rounded text-xs text-gray-600">
              View Only
            </div>
          )}

          <div className="h-full flex flex-col">
            <div className="flex-1">
              {canEdit ? (
                <input
                  type="text"
                  value={selectedSlide.content?.title || ''}
                  placeholder="Click to add title"
                  className="text-3xl font-bold w-full border-none outline-none bg-transparent"
                  readOnly={!canEdit}
                />
              ) : (
                <h1 className="text-3xl font-bold">
                  {selectedSlide.content?.title || 'Untitled Slide'}
                </h1>
              )}
              
              <div className="mt-8">
                {canEdit ? (
                  <textarea
                    placeholder="Click to add content"
                    className="w-full h-32 border-none outline-none bg-transparent resize-none"
                    defaultValue={selectedSlide.content?.content || ''}
                  />
                ) : (
                  <p className="text-gray-700">
                    {selectedSlide.content?.content || 'No content'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500">
          Slide {selectedSlide.order} • {canEdit ? 'Editing enabled' : 'View only'}
        </div>
      </div>
    </div>
  );
};

export default SlideWorkspace;