// frontend\src\components\13d.product-evaluation-grid\1.ProductEvaluationGridTable\ProductEvaluationGridTable.jsx
import React, { useState, useEffect} from 'react';
import useLoginStore from '../../../store/loginStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus, faSave, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import useProductEvaluationGridStore, { initialProductEvaluationGrid } from '../../../store/left-lower-content/13.tools/4.productEvaluationGridStore';
import { useLayoutSettingsStore } from '../../../store/left-lower-content/0.layout-settings/layoutSettingsStore';
import API_URL from '../../../configs/config';
import { ENABLE_CONSOLE_LOGS } from '../../../configs/config';
import './ProductEvaluationGridTable.css';

const ProductEvaluationGridTable = () => {
  const organization = useLayoutSettingsStore.getState().organization;
  const [loading, setLoading] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingDischarge, setLoadingDischarge] = useState(false);
  const [editingCell, setEditingCell] = useState({ id: null, field: null });

  const loggedUser = useLoginStore((state) => state.user);
  const productEvaluationGridTable = useProductEvaluationGridStore((state) => state.productEvaluationGridTable);
  const setProductEvaluationGrid = useProductEvaluationGridStore((state) => state.setProductEvaluationGrid);
  const updateProductEvaluationGridTableField = useProductEvaluationGridStore((state) => state.updateProductEvaluationGridTableField);
  const pushProductEvaluationGridTableField = useProductEvaluationGridStore((state) => state.pushProductEvaluationGridTableField);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProductEvaluationGridTable, setNewProductEvaluationGridTable] = useState({
    productName: '',
    description: '',
    pricingPower: '',
    acceleratingGrowth: '',
    profitMargin: '',
    marketShare: '',
    customerSatisfaction: '',
    innovationPotential: '',
    operationEfficiency: '',
    lifeCycleStage: '',
  });

  const [currentOrder, setCurrentOrder] = useState(productEvaluationGridTable);
  const [draggedId, setDraggedId] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  // Load from localStorage if available
  useEffect(() => {
    const storedData = localStorage.getItem('ProductEvaluationGridTableData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setProductEvaluationGrid(parsedData);

        ENABLE_CONSOLE_LOGS && console.log('ProductEvaluationGridTableData found! and  loaded!');


        // ✅ Treat this as unsaved state, trigger the buttons
        setIsEditing(true);


      } catch (err) {
        ENABLE_CONSOLE_LOGS && console.error('Failed to parse ProductEvaluationGridTableData from localStorage:', err);
      }
    }
  }, [setProductEvaluationGrid]);


  const saveToBackend = async (reordered) => {
    const organization = useLayoutSettingsStore.getState().organization;
  
    try {
      // Step 1: Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
  
      const { csrf_token } = await csrfRes.json();
  
      // Step 2: Send update to backend
      const response = await fetch(`${API_URL}/v1/tools/product-evaluation-grid/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          reordered,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('❌ Failed to update Product Evaluation Grid:', result.message || 'Unknown error');
      } else {
        ENABLE_CONSOLE_LOGS && console.log('✅ Product Evaluation Grid updated:', result.updatedData);
      }
    } catch (error) {
      console.error('❌ Error saving Product Evaluation Grid:', error);
    }
  };

  

  const handleAddDriverClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // ENABLE_CONSOLE_LOGS && console.log('Add Product Evaluation Grid Table button clicked');
      setShowAddModal(true);
    }, 1000);
  };

  // const handleAddNewProductEvaluationGridTable = () => {
  //   ENABLE_CONSOLE_LOGS && console.log('New Product Evaluation Grid Table', JSON.stringify(newProductEvaluationGridTable, null, 2));

  //   // 2. Hide Save / Discharge
  //   setIsEditing(false);

  
  //   // 3. Remove localStorage temp data
  //   localStorage.removeItem('ProductEvaluationGridTableData');
  
  //   // 4. Push to Zustand store
  //   pushProductEvaluationGridTableField(newProductEvaluationGridTable);
  
  //   // 5. Optionally: force-refresh the UI by resetting store (if needed)
  //   // Not required unless you deep reset from localStorage elsewhere
  
  //   // Close modal
  //   setShowAddModal(false);
  
  //   // Reset form input
  //   setNewProductEvaluationGridTable({     
  //     productName: '',
  //     description: '',
  //     pricingPower: '',
  //     acceleratingGrowth: '',
  //     profitMargin: '',
  //     marketShare: '',
  //     customerSatisfaction: '',
  //     innovationPotential: '',
  //     operationEfficiency: '',
  //     lifeCycleStage: '',
  //   });

  // };


  const addProductEvaluationGridToBackend = async (newItem) => {
    const organization = useLayoutSettingsStore.getState().organization;
  
    try {
      // Step 1: Get CSRF token
      const csrfRes = await fetch(`${API_URL}/csrf-token`, {
        credentials: 'include',
      });
  
      const { csrf_token } = await csrfRes.json();
  
      // Step 2: Send data to backend
      const response = await fetch(`${API_URL}/v1/tools/product-evaluation-grid/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrf_token,
        },
        credentials: 'include',
        body: JSON.stringify({
          organization,
          entry: newItem,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        console.error('❌ Failed to add Product Evaluation Grid item:', result.message || 'Unknown error');
      } else {
        ENABLE_CONSOLE_LOGS && console.log('✅ Added Product Evaluation Grid item:', result.newItem);
      }
  
      return result;
    } catch (error) {
      console.error('❌ API error while adding Product Evaluation Grid item:', error);
    }
  };

  const handleAddNewProductEvaluationGridTable = async () => {
    ENABLE_CONSOLE_LOGS &&
      console.log('New Product Evaluation Grid Table', JSON.stringify(newProductEvaluationGridTable, null, 2));
  
    // Call API to add item to backend
    const result = await addProductEvaluationGridToBackend(newProductEvaluationGridTable);
  
    if (result && result.newItem) {
      // 2. Hide Save / Discharge
      setIsEditing(false);
  
      // 3. Remove localStorage temp data
      localStorage.removeItem('ProductEvaluationGridTableData');
  
      // 4. Push to Zustand store
      pushProductEvaluationGridTableField(result.newItem);
  
      // 5. Close modal
      setShowAddModal(false);
  
      // 6. Reset form input
      setNewProductEvaluationGridTable({
        productName: '',
        description: '',
        pricingPower: '',
        acceleratingGrowth: '',
        profitMargin: '',
        marketShare: '',
        customerSatisfaction: '',
        innovationPotential: '',
        operationEfficiency: '',
        lifeCycleStage: '',
      });
    } else {
      console.error('❌ Failed to add item to Product Evaluation Grid');
    }
  };
  
  const handleCellClick = (id, field) => {
    if (loggedUser?.role === 'superadmin') {
      setEditingCell({ id, field });
    }
  };

  const handleInputBlur = (id, field, value) => {
    updateProductEvaluationGridTableField(id, field, value);

    // Update local state for Save/Discharge buttons
    setIsEditing(true);

    // Update localStorage
    const updatedDrivers = productEvaluationGridTable.map((driver) =>
      driver.id === id ? { ...driver, [field]: value } : driver
    );
    localStorage.setItem('ProductEvaluationGridTableData', JSON.stringify(updatedDrivers));

    setEditingCell({ id: null, field: null });
  };

  
  // const handleSaveChanges = () => {

  //   setLoadingSave(true);
  
  //   setTimeout(() => {
  //     setLoadingSave(false);
  
  //     const storedData = localStorage.getItem('ProductEvaluationGridTableData');
  
  //     if (storedData) {
  //       try {
  //         const parsedData = JSON.parse(storedData);
  
  //         // 1. Log to console
  //         ENABLE_CONSOLE_LOGS && console.log('Saved Product Evaluation Grid Table after Save Changes Button:', parsedData);
  
  //         // 2. Update Zustand store
  //         setProductEvaluationGrid(parsedData);

  //         // Reindex IDs
  //         const reordered = parsedData.map((driver, index) => ({
  //           ...driver,
  //           id: index + 1,
  //         }));

  //         ENABLE_CONSOLE_LOGS &&  console.log('Saved Product Evaluation Grid Table (Reindexed):', reordered);

  //         setProductEvaluationGrid(reordered);
  
  //         // 3. Clear edited state (hides buttons)
  //         setIsEditing(false);

  
  //         // 4. Remove from localStorage
  //         localStorage.removeItem('ProductEvaluationGridTableData');
  //       } catch (err) {
  //         ENABLE_CONSOLE_LOGS && console.error('Error parsing ProductEvaluationGridTableData on save:', err);
  //       }
  //     } else {

  //       // No localStorage changes, use current drag order

  //       const reordered = currentOrder.map((driver, index) => ({
  //         ...driver,
  //         id: index + 1,
  //       }));

  //       ENABLE_CONSOLE_LOGS &&  console.log('Saved Product Evaluation Grid Table (reordered):', reordered);
  //       setProductEvaluationGrid(reordered);
  //       setIsEditing(false);


  //       // Remove from localStorage
  //       localStorage.removeItem('ProductEvaluationGridTableData');

  //     }
  //   }, 1000);
  // };
  
  
  const handleSaveChanges = async () => {
    setLoadingSave(true);
  
    setTimeout(async () => {
      setLoadingSave(false);
  
      const storedData = localStorage.getItem('ProductEvaluationGridTableData');
  
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
  
          // 1. Log original parsed data
          ENABLE_CONSOLE_LOGS && console.log('Saved Product Evaluation Grid Table after Save Changes Button:', parsedData);
  
          // 2. Update Zustand store
          setProductEvaluationGrid(parsedData);
  
          // 3. Reindex IDs
          const reordered = parsedData.map((item, index) => ({
            ...item,
            id: index + 1,
          }));
  
          ENABLE_CONSOLE_LOGS && console.log('Saved Product Evaluation Grid Table (Reindexed):', reordered);
  
          // 4. Push to backend
          await saveToBackend(reordered);
  
          // 5. Update Zustand store again (clean, reindexed)
          setProductEvaluationGrid(reordered);
  
          // 6. Clear editing state and local storage
          setIsEditing(false);
          localStorage.removeItem('ProductEvaluationGridTableData');
        } catch (err) {
          ENABLE_CONSOLE_LOGS && console.error('Error parsing ProductEvaluationGridTableData on save:', err);
        }
      } else {
        // No localStorage found, use current drag order
        const reordered = currentOrder.map((item, index) => ({
          ...item,
          id: index + 1,
        }));
  
        ENABLE_CONSOLE_LOGS && console.log('Saved Product Evaluation Grid Table (reordered):', reordered);
  
        await saveToBackend(reordered);
        setProductEvaluationGrid(reordered);
        setIsEditing(false);
        localStorage.removeItem('ProductEvaluationGridTableData');
      }
    }, 1000);
  };
  

  const handleDischargeChanges = () => {
    setLoadingDischarge(true);
    setTimeout(() => {
      setLoadingDischarge(false);
      setShowConfirmModal(true);
    }, 1000);
  };

  const confirmDischargeChanges = () => {
    // 1. Remove from localStorage
    localStorage.removeItem('ProductEvaluationGridTableData');

    // 2. Clear edited state (hides buttons)
    setIsEditing(false);

    // 3. Update Zustand store
    // setProductEvaluationGrid(initialProductEvaluationGrid);
    const { baselineProductEvaluationGrid } = useProductEvaluationGridStore.getState();

    // ✅ Console log to inspect baselineProductEvaluationGrid before setting
    ENABLE_CONSOLE_LOGS &&  console.log('💾 Restoring baselineProductEvaluationGrid:', baselineProductEvaluationGrid);

    setProductEvaluationGrid(baselineProductEvaluationGrid);


    // 4. refresh the table
    setCurrentOrder(baselineProductEvaluationGrid);

    // 5. Hide Modal
    setShowConfirmModal(false);

  };

  const cancelDischargeChanges = () => {
    setShowConfirmModal(false);
  };


  // Sync initial and store changes:
  useEffect(() => {
    setCurrentOrder(productEvaluationGridTable);
  }, [productEvaluationGridTable]);

  // Drag handlers:
  const handleDragStart = (e, id) => {
    setDraggedId(id);
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    if (id === draggedId) return;

    const draggedIndex = currentOrder.findIndex(d => d.id === draggedId);
    const overIndex = currentOrder.findIndex(d => d.id === id);
    const newOrder = [...currentOrder];
    const [moved] = newOrder.splice(draggedIndex, 1);
    newOrder.splice(overIndex, 0, moved);
    setCurrentOrder(newOrder);
    setIsEditing(true);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  
    // Save the new drag order to localStorage
    localStorage.setItem('ProductEvaluationGridTableData', JSON.stringify(currentOrder));
  
    // Also flag changes for Save/Discharge buttons
    setIsEditing(true);

  
    ENABLE_CONSOLE_LOGS && console.log('Drag ended and saved to localStorage:', currentOrder);
  };

  // Save drag order to store:
  const saveDraggedOrder = () => {
    ENABLE_CONSOLE_LOGS &&  console.log('New order:', JSON.stringify(currentOrder, null, 2));
    setProductEvaluationGrid(currentOrder);
    setIsEditing(false);

  };

  // On discharge—confirmation modal does reset order from store
  const confirmDischargeChangesDrag = () => {
    localStorage.removeItem('ProductEvaluationGridTableData');
    setShowConfirmModal(false);
    setCurrentOrder(productEvaluationGridTable);
    setIsEditing(false);
  };

  const isSkeleton = productEvaluationGridTable.some(driver => 
    driver.description === '-' &&
    driver.status === '-'
  );

  const handleDeleteDriver = (id) => {
    const updated = productEvaluationGridTable.filter(driver => driver.id !== id);
    setProductEvaluationGrid(updated);
    localStorage.setItem('ProductEvaluationGridTableData', JSON.stringify(updated));
  
    // Mark as edited
    setIsEditing(true);

  };

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-md ml-[5px] mr-[5px] always-black">
      <div className="header-container">
        <h5 className="text-lg font-semibold always-black">Product Evaluation Grid</h5>
        {loggedUser?.role === 'superadmin' && (
          <div className="flex gap-2">

            {isEditing && <>
                <button className="pure-green-btn" onClick={handleSaveChanges}>
                {loadingSave ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  ) : (
                    <>
                    <FontAwesomeIcon icon={faSave} className="mr-1" />
                    Save Changes
                    </>
                )}
                </button>
                <button className="pure-red-btn" onClick={handleDischargeChanges}>
                  {loadingDischarge ? (
                    <div className="loader-bars">
                      <div></div>
                      <div></div>
                      <div></div>
                    </div>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" />
                        Discard Changes
                      </>
                  )}
                </button>
              </>
            }

            {loggedUser?.role === 'superadmin' && !isSkeleton && (
              <button className="pure-blue-btn ml-2" onClick={handleAddDriverClick} disabled={loading}>
                {loading ? (
                  <div className="loader-bars">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                ) : (
                  <>
                  <FontAwesomeIcon icon={faPlus} className="mr-1" />
                  Add Product Evaluation
                  </>
                )}
              </button>
            )}

          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left border border-gray-200">
          <thead>

            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2 ">Product Name</th>
              <th className="border px-4 py-2 ">Description</th>
              <th className="border px-4 py-2 ">Pricing Power</th>
              <th className="border px-4 py-2 ">Accelerating Growth</th>
              <th className="border px-4 py-2 ">Profit Margin</th>
              <th className="border px-4 py-2 ">Market Share</th>
              <th className="border px-4 py-2 ">Customer Satisfaction</th>
              <th className="border px-4 py-2 ">Innovation Potential</th>
              <th className="border px-4 py-2 ">Operation Efficiency</th>
              <th className="border px-4 py-2 ">lifeCycle Stage</th>
              {loggedUser?.role === 'superadmin' && !isSkeleton && (
                <th className="border px-4 py-2 text-center"></th>
              )}
            </tr>
          </thead>

          <tbody>
            {currentOrder.map(driver => (
              <tr key={driver.id}
                draggable={
                  loggedUser?.role === 'superadmin' &&
                  driver.productName !== '-' &&
                  driver.description !== '-' &&
                  driver.pricingPower !== '-' &&
                  driver.acceleratingGrowth !== '-' &&
                  driver.profitMargin !== '-' &&
                  driver.marketShare !== '-' &&
                  driver.customerSatisfaction !== '-' &&
                  driver.innovationPotential !== '-' &&
                  driver.operationEfficiency !== '-' &&
                  driver.lifeCycleStage !== '-'
                }
                onDragStart={
                  loggedUser?.role === 'superadmin' &&
                  driver.productName !== '-' &&
                  driver.description !== '-' &&
                  driver.pricingPower !== '-' &&
                  driver.acceleratingGrowth !== '-' &&
                  driver.profitMargin !== '-' &&
                  driver.marketShare !== '-' &&
                  driver.customerSatisfaction !== '-' &&
                  driver.innovationPotential !== '-' &&
                  driver.operationEfficiency !== '-' &&
                  driver.lifeCycleStage !== '-'
                    ? (e) => handleDragStart(e, driver.id)
                    : undefined
                }
                onDragOver={
                  loggedUser?.role === 'superadmin' &&
                  driver.productName !== '-' &&
                  driver.description !== '-' &&
                  driver.pricingPower !== '-' &&
                  driver.acceleratingGrowth !== '-' &&
                  driver.profitMargin !== '-' &&
                  driver.marketShare !== '-' &&
                  driver.customerSatisfaction !== '-' &&
                  driver.innovationPotential !== '-' &&
                  driver.operationEfficiency !== '-' &&
                  driver.lifeCycleStage !== '-'
                    ? (e) => handleDragOver(e, driver.id)
                    : undefined
                }
                onDragEnd={
                  loggedUser?.role === 'superadmin' &&
                  driver.productName !== '-' &&
                  driver.description !== '-' &&
                  driver.pricingPower !== '-' &&
                  driver.acceleratingGrowth !== '-' &&
                  driver.profitMargin !== '-' &&
                  driver.marketShare !== '-' &&
                  driver.customerSatisfaction !== '-' &&
                  driver.innovationPotential !== '-' &&
                  driver.operationEfficiency !== '-' &&
                  driver.lifeCycleStage !== '-'
                    ? handleDragEnd
                    : undefined
                }
                className={`hover:bg-gray-50 ${
                  loggedUser?.role === 'superadmin' &&
                  driver.productName !== '-' &&
                  driver.description !== '-' &&
                  driver.pricingPower !== '-' &&
                  driver.acceleratingGrowth !== '-' &&
                  driver.profitMargin !== '-' &&
                  driver.marketShare !== '-' &&
                  driver.customerSatisfaction !== '-' &&
                  driver.innovationPotential !== '-' &&
                  driver.operationEfficiency !== '-' &&
                  driver.lifeCycleStage !== '-'
                    ? 'cursor-move'
                    : 'cursor-default'
                }`}
              >

                {/* Implement skeleton  Loading */}
                
                {/* id */}
                <td className="border px-4 py-3">{isSkeleton ? <div className="skeleton w-6"></div> : driver.id}</td>

                {/* productName: */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.productName !== '-' && handleCellClick(driver.id, 'productName')}
                >
                  {driver.productName === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'productName' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.productName}
                      onBlur={(e) => handleInputBlur(driver.id, 'productName', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.productName
                  )}
                </td>

                {/* description */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.description !== '-' && handleCellClick(driver.id, 'description')}
                >
                  {driver.description === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'description' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.description}
                      onBlur={(e) => handleInputBlur(driver.id, 'description', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.description
                  )}
                </td>

                {/* pricingPower */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.pricingPower !== '-' && handleCellClick(driver.id, 'pricingPower')}
                >
                  {driver.pricingPower === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'pricingPower' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.pricingPower}
                      onBlur={(e) => handleInputBlur(driver.id, 'pricingPower', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.pricingPower
                  )}
                </td>

                {/* acceleratingGrowth */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.acceleratingGrowth !== '-' && handleCellClick(driver.id, 'acceleratingGrowth')}
                >
                  {driver.acceleratingGrowth === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'acceleratingGrowth' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.acceleratingGrowth}
                      onBlur={(e) => handleInputBlur(driver.id, 'acceleratingGrowth', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={1}
                    />
                  ) : (
                    driver.acceleratingGrowth
                  )}
                </td>

                {/* profitMargin */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.profitMargin !== '-' && handleCellClick(driver.id, 'profitMargin')}
                >
                  {driver.profitMargin === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'profitMargin' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.profitMargin}
                      onBlur={(e) => handleInputBlur(driver.id, 'profitMargin', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.profitMargin
                  )}
                </td>


                {/* marketShare */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.marketShare !== '-' && handleCellClick(driver.id, 'marketShare')}
                >
                  {driver.marketShare === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'marketShare' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.marketShare}
                      onBlur={(e) => handleInputBlur(driver.id, 'marketShare', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.marketShare
                  )}
                </td>


                {/* customerSatisfaction */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.customerSatisfaction !== '-' && handleCellClick(driver.id, 'customerSatisfaction')}
                >
                  {driver.customerSatisfaction === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'customerSatisfaction' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.customerSatisfaction}
                      onBlur={(e) => handleInputBlur(driver.id, 'customerSatisfaction', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.customerSatisfaction
                  )}
                </td>


                {/* innovationPotential */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.innovationPotential !== '-' && handleCellClick(driver.id, 'customerSatisfaction')}
                >
                  {driver.innovationPotential === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'innovationPotential' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.innovationPotential}
                      onBlur={(e) => handleInputBlur(driver.id, 'innovationPotential', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.innovationPotential
                  )}
                </td>


                {/* operationEfficiency */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.operationEfficiency !== '-' && handleCellClick(driver.id, 'customerSatisfaction')}
                >
                  {driver.operationEfficiency === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'operationEfficiency' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.operationEfficiency}
                      onBlur={(e) => handleInputBlur(driver.id, 'operationEfficiency', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.operationEfficiency
                  )}
                </td>


                {/* lifeCycleStage */}
                <td
                  className="border px-4 py-3 cursor-pointer"
                  onClick={() => driver.lifeCycleStage !== '-' && handleCellClick(driver.id, 'customerSatisfaction')}
                >
                  {driver.lifeCycleStage === '-' ? (
                    <div className="skeleton w-64 h-5"></div>
                  ) : editingCell.id === driver.id && editingCell.field === 'lifeCycleStage' ? (
                    <textarea
                      autoFocus
                      defaultValue={driver.lifeCycleStage}
                      onBlur={(e) => handleInputBlur(driver.id, 'lifeCycleStage', e.target.value)}
                      className="w-full px-2 py-1 border rounded resize-none"
                      rows={3}
                    />
                  ) : (
                    driver.lifeCycleStage
                  )}
                </td>

                {/* delete button */}
                {loggedUser?.role === 'superadmin' && !isSkeleton && (
                  <td className="border px-4 py-3 text-center">
                    <div
                      onClick={() => handleDeleteDriver(driver.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </div>
                  </td>
                )}
                
              </tr>
            ))}
          </tbody>

        </table>
      </div>


      {showConfirmModal && (
        <div className="modal-add-overlay" onClick={() => setShowConfirmModal(false)}>
          <div className="modal-add-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-add-title">Confirm Discard</div>
            <p className="text-gray-700 text-sm mb-4">
              Are you sure you want to discard all unsaved changes?
            </p>
            <div className="modal-add-buttons">
              <button className="btn-add" onClick={confirmDischargeChanges}>Yes, Discard</button>
              <button className="btn-close" onClick={() => setShowConfirmModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}


      {showAddModal && (
        <div
          className="modal-add-overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="modal-add-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-add-title">Add Product Evaluation</div>


            <label className="modal-add-label">Product Name</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newProductEvaluationGridTable.productName}
              onChange={(e) => setNewProductEvaluationGridTable({ ...newProductEvaluationGridTable, productName: e.target.value })}
            />

            <label className="modal-add-label">Description</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newProductEvaluationGridTable.description}
              onChange={(e) => setNewProductEvaluationGridTable({ ...newProductEvaluationGridTable, description: e.target.value })}
            />

            <label className="modal-add-label">Pricing Power</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newProductEvaluationGridTable.pricingPower}
              onChange={(e) => setNewProductEvaluationGridTable({ ...newProductEvaluationGridTable, pricingPower: e.target.value })}
            />

            <label className="modal-add-label">Accelerating Growth</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newProductEvaluationGridTable.acceleratingGrowth}
              onChange={(e) => setNewProductEvaluationGridTable({ ...newProductEvaluationGridTable, acceleratingGrowth: e.target.value })}
            />

            <label className="modal-add-label">Profit Margin</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newProductEvaluationGridTable.profitMargin}
              onChange={(e) => setNewProductEvaluationGridTable({ ...newProductEvaluationGridTable, profitMargin: e.target.value })}
            />

            <label className="modal-add-label">Market Share</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newProductEvaluationGridTable.marketShare}
              onChange={(e) => setNewProductEvaluationGridTable({ ...newProductEvaluationGridTable, marketShare: e.target.value })}
            />

            <label className="modal-add-label">Customer Satisfaction</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newProductEvaluationGridTable.customerSatisfaction}
              onChange={(e) => setNewProductEvaluationGridTable({ ...newProductEvaluationGridTable, customerSatisfaction: e.target.value })}
            />


            <label className="modal-add-label">Innovation Potential</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newProductEvaluationGridTable.innovationPotential}
              onChange={(e) => setNewProductEvaluationGridTable({ ...newProductEvaluationGridTable, innovationPotential: e.target.value })}
            />


            <label className="modal-add-label">Operation Efficiency</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newProductEvaluationGridTable.operationEfficiency}
              onChange={(e) => setNewProductEvaluationGridTable({ ...newProductEvaluationGridTable, operationEfficiency: e.target.value })}
            />

            <label className="modal-add-label">lifeCycle Stage</label>
            <textarea
              className="modal-add-input"
              rows="1"
              value={newProductEvaluationGridTable.lifeCycleStage}
              onChange={(e) => setNewProductEvaluationGridTable({ ...newProductEvaluationGridTable, lifeCycleStage: e.target.value })}
            />

            <div className="modal-add-buttons">
              <button className="btn-add" onClick={handleAddNewProductEvaluationGridTable}>Add</button>
              <button className="btn-close" onClick={() => setShowAddModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default ProductEvaluationGridTable;
