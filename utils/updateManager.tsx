import React, { useState, useEffect } from 'react';
import { UpdateModal } from '@/components/common/UpdateModal';
import { checkVersionGate, openStoreListing } from './versionCheck';

interface UpdateManagerProps {
  children: React.ReactNode;
}

export const UpdateManager: React.FC<UpdateManagerProps> = ({ children }) => {
  const [updateState, setUpdateState] = useState<{
    visible: boolean;
    type: 'force' | 'optional';
    currentVersion: number;
    newVersion: number;
  } | null>(null);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        const result = await checkVersionGate();
        
        if (result.action === 'force_update') {
          setUpdateState({
            visible: true,
            type: 'force',
            currentVersion: result.current,
            newVersion: result.minimum,
          });
        } else if (result.action === 'soft_update') {
          setUpdateState({
            visible: true,
            type: 'optional',
            currentVersion: result.current,
            newVersion: result.latest,
          });
        }
      } catch (error) {
        console.error('Update check failed:', error);
      }
    };

    checkForUpdates();
  }, []);

  const handleUpdate = () => {
    openStoreListing();
    if (updateState?.type === 'optional') {
      setUpdateState(null);
    }
    // For force updates, keep modal visible until app is closed/updated
  };

  const handleLater = () => {
    if (updateState?.type === 'optional') {
      setUpdateState(null);
    }
  };

  return (
    <>
      {children}
      {updateState && (
        <UpdateModal
          visible={updateState.visible}
          type={updateState.type}
          currentVersion={updateState.currentVersion}
          newVersion={updateState.newVersion}
          onUpdate={handleUpdate}
          onLater={updateState.type === 'optional' ? handleLater : undefined}
        />
      )}
    </>
  );
};