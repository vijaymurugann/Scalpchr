import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Archive, RefreshCw } from 'lucide-react-native';
import { COLORS } from '../utils/mockData';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48 - 24) / 3;

export default function ArchiveScreen({ archive, onRestore }) {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Archived Assets</Text>
        <Text style={styles.subtitle}>
          Items you have removed from your collections. Restore them to add them back.
        </Text>
      </View>

      {archive.length > 0 ? (
        <FlatList
          data={archive}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.gridRow}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.archiveCard}
              activeOpacity={0.8}
              onPress={() => onRestore(item)}
            >
              <Image
                source={{ uri: item.url }}
                style={styles.archiveImage}
                contentFit="cover"
              />
              <View style={styles.archiveOverlayVisible}>
                <RefreshCw size={16} color={COLORS.text} />
              </View>
              <View style={styles.archiveLabel}>
                <Text style={styles.archiveLabelText} numberOfLines={1}>
                  {item.originalFolderName}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Archive size={32} color={COLORS.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Archive is empty</Text>
          <Text style={styles.emptySubtitle}>Deleted items will appear here.</Text>
        </View>
      )}
    </SafeAreaView>
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '300',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  gridContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  archiveCard: {
    width: CARD_SIZE,
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  archiveImage: {
    width: '100%',
    height: '100%',
    opacity: 0.6,
  },
  archiveOverlayVisible: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 14,
  },
  archiveLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  archiveLabelText: {
    fontSize: 9,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
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
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
