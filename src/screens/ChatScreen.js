import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Send,
  ChevronRight,
  X,
  Info,
  MessageSquare,
  Hash,
  UserPlus,
  UserMinus,
  Trash2,
  LogOut,
  Menu,
} from 'lucide-react-native';
import { COLORS, initialChannels, initialMessages } from '../utils/mockData';

export default function ChatScreen() {
  const [channels, setChannels] = useState(initialChannels);
  const [activeChannelId, setActiveChannelId] = useState('general');
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isChannelListOpen, setIsChannelListOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  
  const flatListRef = useRef(null);
  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const currentMessages = messages.filter(m => m.channelId === activeChannelId);

  useEffect(() => {
    if (flatListRef.current && currentMessages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [currentMessages.length, activeChannelId]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { 
      id: Date.now(), 
      user: "You", 
      avatar: "AT", 
      text: input, 
      time: "Now", 
      isMe: true, 
      channelId: activeChannelId 
    }]);
    setInput("");
  };

  const handleAddMember = () => {
    if (!newMemberName.trim()) return;
    const initials = newMemberName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
    const newMember = {
      id: Date.now(),
      name: newMemberName,
      role: 'member',
      avatar: initials
    };
    setChannels(prev => prev.map(ch => {
      if (ch.id === activeChannelId) {
        return { ...ch, members: [...ch.members, newMember] };
      }
      return ch;
    }));
    setNewMemberName("");
  };

  const handleRemoveMember = (memberId) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id === activeChannelId) {
        return { ...ch, members: ch.members.filter(m => m.id !== memberId) };
      }
      return ch;
    }));
  };

  const handleDeleteGroup = () => {
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete ${activeChannel.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            const newChannels = channels.filter(c => c.id !== activeChannelId);
            setChannels(newChannels);
            setActiveChannelId(newChannels.length > 0 ? newChannels[0].id : null);
            setIsSettingsOpen(false);
          }
        }
      ]
    );
  };

  const handleLeaveGroup = () => {
    handleRemoveMember(99);
    setIsSettingsOpen(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setIsChannelListOpen(true)}
          >
            <Menu size={24} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <View style={styles.channelNameRow}>
              <Text style={styles.channelName}>{activeChannel?.name}</Text>
              <TouchableOpacity 
                style={[styles.infoButton, isSettingsOpen && styles.infoButtonActive]}
                onPress={() => setIsSettingsOpen(!isSettingsOpen)}
              >
                <Info size={16} color={isSettingsOpen ? COLORS.background : COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.channelDescription} numberOfLines={1}>
              {activeChannel?.description}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.membersButton}
          onPress={() => setIsSettingsOpen(true)}
        >
          <View style={styles.memberAvatars}>
            {activeChannel?.members.slice(0, 3).map((m, i) => (
              <View key={m.id} style={[styles.memberAvatar, { marginLeft: i > 0 ? -8 : 0 }]}>
                <Text style={styles.memberAvatarText}>{m.avatar}</Text>
              </View>
            ))}
            {activeChannel?.members.length > 3 && (
              <View style={[styles.memberAvatar, styles.memberAvatarMore, { marginLeft: -8 }]}>
                <Text style={styles.memberAvatarText}>+{activeChannel.members.length - 3}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView 
        style={styles.messagesContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {currentMessages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={currentMessages}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.messagesList}
            renderItem={({ item: msg }) => (
              <View style={[styles.messageRow, msg.isMe && styles.messageRowMe]}>
                <View style={[styles.messageBubble, msg.isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
                  {!msg.isMe && (
                    <View style={styles.messageHeader}>
                      <View style={styles.messageAvatar}>
                        <Text style={styles.messageAvatarText}>{msg.avatar}</Text>
                      </View>
                      <Text style={styles.messageSender}>{msg.user}</Text>
                      <Text style={styles.messageTime}>{msg.time}</Text>
                    </View>
                  )}
                  {msg.isMe && (
                    <View style={styles.messageHeaderMe}>
                      <Text style={styles.messageTime}>{msg.time}</Text>
                    </View>
                  )}
                  <Text style={[styles.messageText, msg.isMe && styles.messageTextMe]}>
                    {msg.text}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={styles.emptyMessages}>
            <MessageSquare size={32} color={COLORS.textMuted} style={{ opacity: 0.3 }} />
            <Text style={styles.emptyMessagesText}>No messages yet. Start the conversation!</Text>
          </View>
        )}

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message..."
            placeholderTextColor={COLORS.textMuted}
          />
          <TouchableOpacity 
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!input.trim()}
          >
            <Send size={18} color={input.trim() ? COLORS.primary : COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Channel List Modal */}
      <Modal
        visible={isChannelListOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsChannelListOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.channelListModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Channels</Text>
              <TouchableOpacity onPress={() => setIsChannelListOpen(false)}>
                <X size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.channelList}>
              {channels.map((ch) => (
                <TouchableOpacity
                  key={ch.id}
                  style={[styles.channelItem, activeChannelId === ch.id && styles.channelItemActive]}
                  onPress={() => {
                    setActiveChannelId(ch.id);
                    setIsChannelListOpen(false);
                  }}
                >
                  <Text style={[styles.channelItemText, activeChannelId === ch.id && styles.channelItemTextActive]}>
                    {ch.name}
                  </Text>
                  {activeChannelId === ch.id && (
                    <ChevronRight size={14} color={COLORS.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Settings Modal */}
      <Modal
        visible={isSettingsOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsSettingsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Group Info</Text>
              <TouchableOpacity onPress={() => setIsSettingsOpen(false)}>
                <X size={24} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.settingsContent}>
              {/* Group Header */}
              <View style={styles.groupHeader}>
                <View style={styles.groupIcon}>
                  <Hash size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.groupName}>{activeChannel?.name}</Text>
                <Text style={styles.groupMemberCount}>{activeChannel?.members.length} members</Text>
              </View>

              {/* About */}
              <View style={styles.settingsSection}>
                <Text style={styles.settingsSectionTitle}>About</Text>
                <View style={styles.aboutBox}>
                  <Text style={styles.aboutText}>{activeChannel?.description}</Text>
                </View>
              </View>

              {/* Members */}
              <View style={styles.settingsSection}>
                <View style={styles.settingsSectionHeader}>
                  <Text style={styles.settingsSectionTitle}>Members</Text>
                  <View style={styles.memberCountBadge}>
                    <Text style={styles.memberCountText}>{activeChannel?.members.length}</Text>
                  </View>
                </View>

                {/* Add Member */}
                <View style={styles.addMemberContainer}>
                  <UserPlus size={14} color={COLORS.textMuted} style={styles.addMemberIcon} />
                  <TextInput
                    style={styles.addMemberInput}
                    placeholder="Add member by name..."
                    placeholderTextColor={COLORS.textMuted}
                    value={newMemberName}
                    onChangeText={setNewMemberName}
                    onSubmitEditing={handleAddMember}
                  />
                </View>

                {/* Member List */}
                {activeChannel?.members.map((member) => (
                  <View key={member.id} style={styles.memberItem}>
                    <View style={styles.memberItemAvatar}>
                      <Text style={styles.memberItemAvatarText}>{member.avatar}</Text>
                    </View>
                    <View style={styles.memberItemInfo}>
                      <Text style={styles.memberItemName}>{member.name}</Text>
                      <Text style={styles.memberItemRole}>{member.role}</Text>
                    </View>
                    {member.id !== 99 && (
                      <TouchableOpacity 
                        style={styles.removeMemberButton}
                        onPress={() => handleRemoveMember(member.id)}
                      >
                        <UserMinus size={16} color={COLORS.textMuted} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>

              {/* Actions */}
              <View style={styles.settingsActions}>
                <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
                  <LogOut size={16} color={COLORS.textSecondary} />
                  <Text style={styles.leaveButtonText}>Leave Group</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteGroup}>
                  <Trash2 size={16} color="#ef4444" />
                  <Text style={styles.deleteButtonText}>Delete Group</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuButton: {
    padding: 4,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  channelNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  infoButton: {
    padding: 4,
    borderRadius: 4,
  },
  infoButtonActive: {
    backgroundColor: COLORS.primary,
  },
  channelDescription: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  membersButton: {
    padding: 4,
  },
  memberAvatars: {
    flexDirection: 'row',
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surfaceLighter,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  memberAvatarMore: {
    backgroundColor: COLORS.surfaceLighter,
  },
  memberAvatarText: {
    fontSize: 10,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 100,
  },
  messageRow: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  messageRowMe: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 12,
  },
  messageBubbleMe: {
    backgroundColor: COLORS.primary,
    borderTopRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: COLORS.surfaceLighter,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  messageHeaderMe: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  messageAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.surfaceLighter,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageAvatarText: {
    fontSize: 8,
    color: COLORS.text,
    fontWeight: 'bold',
  },
  messageSender: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  messageTime: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  messageText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  messageTextMe: {
    color: COLORS.background,
  },
  emptyMessages: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyMessagesText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.surfaceLighter,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  channelListModal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  settingsModal: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: COLORS.text,
  },
  channelList: {
    padding: 12,
  },
  channelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
  },
  channelItemActive: {
    backgroundColor: COLORS.border,
  },
  channelItemText: {
    fontSize: 15,
    color: COLORS.textSecondary,
  },
  channelItemTextActive: {
    color: COLORS.primary,
  },
  settingsContent: {
    padding: 20,
  },
  groupHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  groupIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceLighter,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  groupName: {
    fontSize: 20,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 4,
  },
  groupMemberCount: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  settingsSection: {
    marginBottom: 28,
  },
  settingsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingsSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  memberCountBadge: {
    backgroundColor: 'rgba(174, 191, 150, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  memberCountText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '500',
  },
  aboutBox: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  aboutText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  addMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  addMemberIcon: {
    marginRight: 8,
  },
  addMemberInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  memberItemAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surfaceLighter,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberItemAvatarText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  memberItemInfo: {
    flex: 1,
  },
  memberItemName: {
    fontSize: 14,
    color: COLORS.text,
  },
  memberItemRole: {
    fontSize: 11,
    color: COLORS.textMuted,
    textTransform: 'capitalize',
  },
  removeMemberButton: {
    padding: 8,
  },
  settingsActions: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
    marginBottom: 40,
  },
  leaveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  leaveButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    color: '#ef4444',
  },
});
