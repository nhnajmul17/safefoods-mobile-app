import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { deepGreenColor } from '@/constants/Colors';

interface UpdateModalProps {
  visible: boolean;
  type: 'force' | 'optional';
  onUpdate: () => void;
  onLater?: () => void;
  currentVersion: number;
  newVersion: number;
}

const { width } = Dimensions.get('window');

export const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  type,
  onUpdate,
  onLater,
  currentVersion,
  newVersion,
}) => {
  const isForceUpdate = type === 'force';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isForceUpdate ? undefined : onLater}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isForceUpdate ? 'Update Required' : 'Update Available'}
            </Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.message}>
              {isForceUpdate
                ? 'A new version of Safe Food is required to continue. Please update your app.'
                : 'A new version of Safe Food is available with improvements and bug fixes.'}
            </Text>

            <View style={styles.versionInfo}>
              <Text style={styles.versionText}>
                Current Version: {currentVersion}
              </Text>
              <Text style={styles.versionText}>
                New Version: {newVersion}
              </Text>
            </View>

            {isForceUpdate && (
              <Text style={styles.warningText}>
                You cannot continue using the app without updating.
              </Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            {!isForceUpdate && onLater && (
              <TouchableOpacity
                style={[styles.button, styles.laterButton]}
                onPress={onLater}
              >
                <Text style={styles.laterButtonText}>Later</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.button,
                styles.updateButton,
                isForceUpdate && styles.singleButton,
              ]}
              onPress={onUpdate}
            >
              <Text style={styles.updateButtonText}>
                {isForceUpdate ? 'Update Now' : 'Update'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: width * 0.85,
    maxWidth: 400,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  header: {
    backgroundColor: deepGreenColor,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  versionInfo: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  versionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  singleButton: {
    flex: 1,
  },
  laterButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  laterButtonText: {
    color: '#6c757d',
    fontSize: 16,
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: deepGreenColor,
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});