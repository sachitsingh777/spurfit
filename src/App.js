import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Customized } from 'recharts';
import './index.css';
import block1 from "./image/block1.png";
import block2 from "./image/block2.png";
import block3 from "./image/block3.png";
import block4 from "./image/block4.png";
import block5 from "./image/block5.png";
import block6 from "./image/block6.png";

const CustomBar = ({ x, y, width, height, image }) => (
  <svg
    x={x}
    y={y}
    width={width}
    height={height}
    xmlns="http://www.w3.org/2000/svg"
  >
    <image
      href={image}
      x="0"
      y="0"
      width={width}
      height={height}
      style={{ objectFit: 'cover' }}
    />
  </svg>
);

const App = () => {
  const [items, setItems] = useState({
    col1: [
      { id: 'item-1', name: 'Warmup', image: block1, size: 3 },
      { id: 'item-2', name: 'Active', image: block2, size: 3 },
      { id: 'item-3', name: 'Cooldown', image: block3, size: 3 },
      { id: 'item-4', name: 'Two Step Repeats', image: block4, size: 4 },
      { id: 'item-5', name: 'Rampup', image: block5, size: 4 },
      { id: 'item-6', name: 'Rampdown', image: block6, size: 4 },
    ],
    col2: [],
    col3: [],
  });

  useEffect(() => {
    setItems((prevItems) => ({
      ...prevItems,
      col3: prevItems.col2.map(item => ({ ...item, id: `${item.id}-copy-${Date.now()}` })),
    }));
  }, [items.col2]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceDroppableId = source.droppableId;
    const destinationDroppableId = destination.droppableId;
    if (sourceDroppableId === 'col2') return;
    if (sourceDroppableId === 'col1' && destinationDroppableId !== 'col1') {
      const itemToAdd = items[sourceDroppableId][source.index];
      if (destinationDroppableId === 'col2') {
        const newCol2Items = Array.from(items.col2);
        newCol2Items.splice(destination.index, 0, { ...itemToAdd, id: `${itemToAdd.id}-copy-${Date.now()}` });
        setItems((prevItems) => ({
          ...prevItems,
          col2: newCol2Items,
        }));
      }
      return;
    }

    if (sourceDroppableId === destinationDroppableId) {
      const reorderedItems = reorder(
        items[sourceDroppableId],
        source.index,
        destination.index
      );
      setItems((prevItems) => ({
        ...prevItems,
        [sourceDroppableId]: reorderedItems,
      }));
    } else {
      const result = move(
        items[sourceDroppableId],
        items[destinationDroppableId],
        source,
        destination
      );
      setItems((prevItems) => ({
        ...prevItems,
        [sourceDroppableId]: result[sourceDroppableId],
        [destinationDroppableId]: result[destinationDroppableId],
      }));
    }
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const handleItemClick = (item) => {
    if (items.col2.length === 0) {
      const newCol2Item = { ...item, id: `${item.id}-copy-${Date.now()}` };
      setItems((prevItems) => ({
        ...prevItems,
        col2: [newCol2Item],
        col3: [...prevItems.col3, newCol2Item],
      }));
    }
  };

  const renderCustomBar = (props) => {
    const { x, y, width, height, fill, payload } = props;
    const item = items.col2.find(i => i.name === payload.name);
    return (
      <CustomBar
        x={x}
        y={y}
        width={width}
        height={height}
        image={item ? item.image : ''}
      />
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="App font-sans mx-8">
        <header className="flex justify-between p-4 shadow-md bg-white">
          <div className='flex items-center'>
            <span className="mr-4 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left">
                <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
              </svg>
            </span>
            <h3 className='font-extrabold' >Run Workout</h3>
            <span className="ml-4 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil">
                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>
              </svg>
            </span>
          </div>
          <button className='bg-custom-gradient p-2 rounded-full text-white'>
            Save Workout
          </button>
        </header>
        <main className="p-6 bg-gray-100 h-full flex">
          <div className="w-1/3 p-4 bg-white shadow rounded border border-gray-300 max-h-[250px] overflow-auto">
            <h2 className='font-bold text-2xl'>
              Click or drag the blocks to build a workout
            </h2>
            <Droppable droppableId="col1">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-3 gap-4 p-2"
                >
                  {items.col1.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => handleItemClick(item)}
                        >
                          <img src={item.image} alt={item.name} title={item.name} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <div className="w-2/3 h-full p-4">
            <div className="mb-4 h-full">
              <Droppable droppableId="col2" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex space-x-4 bg-white w-full h-[250px] p-4 shadow rounded border border-gray-300"
                  >
                    {items.col2.length > 0 && (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={items.col2}
                          margin={{
                            top: 5, right: 30, left: 20, bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="size" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="size" fill="#8884d8" shape={renderCustomBar} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <Droppable droppableId="col3" direction="vertical">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4 bg-white p-4 shadow rounded border border-gray-300 min-h-[200px]"
                >
                  {items.col3.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 shadow rounded border border-gray-300"
                        >
                          <div className='flex justify-between font-bold'>
                            <span>
                              {item.name}
                            </span>
                            <span><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-dots-vertical" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
</svg></span>
                          </div>
                          <hr/>
                          <div className='flex  p-2 justify-between items-center'>
                            <div className='flex gap-3 text-center'>
                              <span><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-grip-vertical" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
</svg></span>
<span><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-photo" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M15 8h.01" />
  <path d="M3 6a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3v-12z" />
  <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
  <path d="M14 14l1 -1c.928 -.893 2.072 -.893 3 0l3 3" />
</svg></span>
   <div className='text-center'>Run</div>
                            </div> <div className='flex gap-3'>
                            <span className='border border-spacing-1 p-1 rounded-md'>{item.size} Km</span>
                            <span className='border border-spacing-1 p-1 rounded-md'><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-dots-vertical" width="25" height="25" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M12 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
  <path d="M12 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
</svg></span>
                          </div>
                          </div>
                          <div>
                          <div class="line-with-text">
                            <button className='border border-spacing-14 border-blue-600 p-2 rounded-full'>Add SUbstep</button>
                          </div>
                          </div>
                         
 
                           
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </main>
      </div>
    </DragDropContext>
  );
};

export default App;
