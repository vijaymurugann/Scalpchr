import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { X, MessageCircle } from 'lucide-react-native';
import { COLORS } from '../utils/mockData';

const { width, height } = Dimensions.get('window');

export default function ImageViewer({ image, onClose, onAddComment }) {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedPoint, setSelectedPoint] = useState(null);

  const handleImagePress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const imageWidth = width - 32;
    const imageHeight = height * 0.6;
    
    const x = (locationX / imageWidth) * 100;
    const y = (locationY / imageHeight) * 100;
    
    setSelectedPoint({ x, y });
    setShowCommentInput(true);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim() || !selectedPoint) return;
    
    onAddComment({
      id: Date.now(),
      x: selectedPoint.x,
      y: selectedPoint.y,
      text: commentText,
      user: "You",
      date: new Date().toLocaleDateString()
    });
    
    setShowCommentInput(false);
    setCommentText("");
    setSelectedPoint(null);
  };

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.imageName} numberOfLines={1}>{image.name}</Text>
            <Text style={styles.hint}>Tap image to comment</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Image with comments */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          centerContent
        >
          <Pressable 
            style={styles.imageContainer}
            onPress={handleImagePress}
          >
            <Image
              source={{ uri: image.url }}
              style={styles.image}
              contentFit="contain"
            />
            
            {/* Comment markers */}
            {image.comments.map((comment) => (
              <TouchableOpacity
                key={comment.id}
                style={[
                  styles.commentMarker,
                  { left: `${comment.x}%`, top: `${comment.y}%` }
                ]}
              >
                <Text style={styles.commentMarkerText}>
                  {comment.user[0]}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Selected point indicator */}
            {selectedPoint && (
              <View
                style={[
                  styles.selectedPoint,
                  { left: `${selectedPoint.x}%`, top: `${selectedPoint.y}%` }
                ]}
              />
            )}
          </Pressable>
        </ScrollView>

        {/* Comments list */}
        {image.comments.length > 0 && !showCommentInput && (
          <View style={styles.commentsSection}>
            <Text style={styles.commentsSectionTitle}>
              Comments ({image.comments.length})
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.commentsList}
            >
              {image.comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <View style={styles.commentAvatar}>
                      <Text style={styles.commentAvatarText}>{comment.user[0]}</Text>
                    </View>
                    <Text style={styles.commentUser}>{comment.user}</Text>
                  </View>
                  <Text style={styles.commentTextDisplay}>{comment.text}</Text>
                  <Text style={styles.commentDate}>{comment.date}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Comment input */}
        {showCommentInput && (
          <View style={styles.commentInputContainer}>
            <View style={styles.commentInputHeader}>
              <Text style={styles.commentInputTitle}>Add Point Comment</Text>
              <TouchableOpacity onPress={() => {
                setShowCommentInput(false);
                setSelectedPoint(null);
              }}>
                <X size={20} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="What's on your mind?"
              placeholderTextColor={COLORS.textMuted}
              value={commentText}
              onChangeText={setCommentText}
              multiline
              autoFocus
            />
            <View style={styles.commentInputActions}>
              <TouchableOpacity 
                style={styles.cancelCommentButton}
                onPress={() => {
                  setShowCommentInput(false);
                  setSelectedPoint(null);
                }}
              >
                <Text style={styles.cancelCommentText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitCommentButton}
                onPress={handleSubmitComment}
              >
                <Text style={styles.submitCommentText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
    paddingTop: 50,
  },
  headerLeft: {
    flex: 1,
  },
  imageName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  hint: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    width: width - 32,
    height: height * 0.6,
    marginHorizontal: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  commentMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    marginLeft: -14,
    marginTop: -14,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.text,
  },
  commentMarkerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  selectedPoint: {
    position: 'absolute',
    width: 16,
    height: 16,
    marginLeft: -8,
    marginTop: -8,
    borderRadius: 8,
    backgroundColor: COLORS.text,
  },
  commentsSection: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  commentsSectionTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  commentsList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  commentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 14,
    width: 200,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  commentAvatarText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  commentUser: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.primary,
  },
  commentTextDisplay: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  commentDate: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  commentInputContainer: {
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
    padding: 16,
  },
  commentInputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentInputTitle: {
    fontSize: 12,
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '500',
  },
  commentInput: {
    backgroundColor: COLORS.surfaceLighter,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  commentInputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  },
  cancelCommentButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelCommentText: {
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  submitCommentButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  submitCommentText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: 13,
  },
});
