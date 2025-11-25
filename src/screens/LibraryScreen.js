import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Dimensions,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  ChevronRight,
  Folder,
  MoreVertical,
  X,
  Upload,
  CloudUpload,
  Image as ImageIcon,
  Trash2,
  MessageCircle,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, generateMockContent } from '../utils/mockData';
import ImageViewer from '../components/ImageViewer';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48 - 16) / 2;

export default function LibraryScreen({ folders, setFolders, onArchiveItem }) {
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [viewingImage, setViewingImage] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const activeFolder = folders.find(f => f.id === selectedFolderId);

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;

    const newFolder = {
      id: Date.now(),
      name: newFolderName,
      items: 0,
      date: "Just now",
      cover: "https://images.unsplash.com/photo-1628151015968-3a4429e9ef04?q=80&w=800&auto=format&fit=crop",
      content: []
    };

    setFolders([newFolder, ...folders]);
    setNewFolderName("");
    setIsCreating(false);
  };

  const handleUploadImage = async () => {
    if (!selectedFolderId) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newImage = {
        id: Date.now(),
        url: result.assets[0].uri,
        name: `Image_${Date.now()}.jpg`,
        comments: []
      };

      setFolders(prevFolders => prevFolders.map(folder => {
        if (folder.id === selectedFolderId) {
          const updatedContent = [newImage, ...folder.content];
          return {
            ...folder,
            content: updatedContent,
            items: updatedContent.length,
            cover: folder.items === 0 ? newImage.url : folder.cover
          };
        }
        return folder;
      }));
    }
  };

  const handleAddComment = (imageId, commentData) => {
    setFolders(prevFolders => prevFolders.map(folder => {
      if (folder.id === selectedFolderId) {
        return {
          ...folder,
          content: folder.content.map(img => {
            if (img.id === imageId) {
              return { ...img, comments: [...img.comments, commentData] };
            }
            return img;
          })
        };
      }
      return folder;
    }));
  };

  const currentViewingImageObject = activeFolder?.content.find(img => img.id === viewingImage?.id);

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {activeFolder ? (
            <TouchableOpacity 
              style={styles.breadcrumb}
              onPress={() => setSelectedFolderId(null)}
            >
              <Text style={styles.breadcrumbText}>Library</Text>
              <ChevronRight size={18} color={COLORS.primary} />
              <Text style={styles.breadcrumbActive}>{activeFolder.name}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.title}>Design Library</Text>
          )}
        </View>
        
        <Text style={styles.subtitle}>
          {activeFolder 
            ? `${activeFolder.items} assets in this collection.`
            : "Browse your collection of premium architectural resources."}
        </Text>

        <View style={styles.headerActions}>
          {!activeFolder && (
            <View style={styles.searchContainer}>
              <Search size={16} color={COLORS.textMuted} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search assets..."
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={activeFolder ? handleUploadImage : () => setIsCreating(true)}
          >
            {activeFolder ? (
              <>
                <Upload size={18} color={COLORS.background} />
                <Text style={styles.actionButtonText}>Upload</Text>
              </>
            ) : (
              <>
                <Plus size={18} color={COLORS.background} />
                <Text style={styles.actionButtonText}>Add Folder</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Create Folder Modal */}
      <Modal
        visible={isCreating}
        transparent
        animationType="fade"
        onRequestClose={() => setIsCreating(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Collection</Text>
              <TouchableOpacity onPress={() => setIsCreating(false)}>
                <X size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.inputLabel}>Collection Name</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Urban Sustainable"
              placeholderTextColor={COLORS.textMuted}
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setIsCreating(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.createButton, !newFolderName.trim() && styles.createButtonDisabled]}
                onPress={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                <Text style={styles.createButtonText}>Create Folder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Image Viewer Modal */}
      {viewingImage && currentViewingImageObject && (
        <ImageViewer
          image={currentViewingImageObject}
          onClose={() => setViewingImage(null)}
          onAddComment={(comment) => handleAddComment(currentViewingImageObject.id, comment)}
        />
      )}

      {/* Content */}
      {activeFolder ? (
        <FolderDetailView
          folder={activeFolder}
          onUpload={handleUploadImage}
          onImageClick={setViewingImage}
          onArchive={(itemId) => onArchiveItem(activeFolder.id, itemId)}
        />
      ) : (
        <FlatList
          data={filteredFolders}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item: folder }) => (
            <TouchableOpacity
              style={styles.folderCard}
              onPress={() => setSelectedFolderId(folder.id)}
              activeOpacity={0.8}
            >
              <View style={styles.folderImageContainer}>
                <Image
                  source={{ uri: folder.cover }}
                  style={styles.folderImage}
                  contentFit="cover"
                />
                <View style={styles.folderImageOverlay} />
                <View style={styles.folderIconContainer}>
                  <Folder size={20} color={COLORS.primary} />
                </View>
              </View>
              <View style={styles.folderInfo}>
                <View style={styles.folderNameRow}>
                  <Text style={styles.folderName} numberOfLines={1}>{folder.name}</Text>
                  <TouchableOpacity>
                    <MoreVertical size={16} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>
                <View style={styles.folderMeta}>
                  <Text style={styles.folderMetaText}>{folder.items} assets</Text>
                  <Text style={styles.folderMetaText}>Edited {folder.date}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function FolderDetailView({ folder, onUpload, onImageClick, onArchive }) {
  const hasContent = folder.content && folder.content.length > 0;

  if (!hasContent) {
    return (
      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <CloudUpload size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.emptyTitle}>This collection is empty</Text>
        <Text style={styles.emptySubtitle}>
          Start building your inspiration board by uploading high-quality architectural images.
        </Text>
        <TouchableOpacity style={styles.emptyButton} onPress={onUpload}>
          <Upload size={18} color={COLORS.background} />
          <Text style={styles.emptyButtonText}>Upload First Image</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={[{ id: 'add-new' }, ...folder.content]}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={styles.gridRow}
      renderItem={({ item }) => {
        if (item.id === 'add-new') {
          return (
            <TouchableOpacity style={styles.addImageCard} onPress={onUpload}>
              <View style={styles.addImageIcon}>
                <Plus size={24} color={COLORS.text} />
              </View>
              <Text style={styles.addImageText}>Add Image</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            style={styles.imageCard}
            onPress={() => onImageClick(item)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: item.url }}
              style={styles.imageCardImage}
              contentFit="cover"
            />
            {item.comments.length > 0 && (
              <View style={styles.commentBadge}>
                <MessageCircle size={10} color={COLORS.background} />
                <Text style={styles.commentBadgeText}>{item.comments.length}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.archiveButton}
              onPress={() => {
                Alert.alert(
                  'Archive Item',
                  'Move this item to archive?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Archive', onPress: () => onArchive(item.id) }
                  ]
                );
              }}
            >
              <Trash2 size={16} color={COLORS.text} />
            </TouchableOpacity>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTop: {
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: COLORS.text,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 20,
    fontWeight: '300',
    color: COLORS.textSecondary,
  },
  breadcrumbActive: {
    fontSize: 20,
    fontWeight: '300',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  actionButtonText: {
    color: COLORS.background,
    fontWeight: '500',
    fontSize: 14,
  },
  gridContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  folderCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  folderImageContainer: {
    height: 120,
    position: 'relative',
  },
  folderImage: {
    width: '100%',
    height: '100%',
  },
  folderImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  folderIconContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  folderInfo: {
    padding: 14,
  },
  folderNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  folderName: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  folderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  folderMetaText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
  },
  inputLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: COLORS.surfaceLight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: COLORS.background,
    fontWeight: '500',
    fontSize: 14,
  },
  // Empty state
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  emptyButtonText: {
    color: COLORS.background,
    fontWeight: '500',
    fontSize: 15,
  },
  // Image cards
  addImageCard: {
    width: CARD_WIDTH,
    aspectRatio: 4/5,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.borderLight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addImageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  imageCard: {
    width: CARD_WIDTH,
    aspectRatio: 4/5,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageCardImage: {
    width: '100%',
    height: '100%',
  },
  commentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  commentBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  archiveButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 20,
  },
});
