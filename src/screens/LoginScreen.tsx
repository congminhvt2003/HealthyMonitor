import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity, 
  ActivityIndicator, Alert, SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native';

import { useTheme } from '../theme/ThemeContext';
import { loginWithEmail, loginAsGuest } from '../services/authService';

// Lưu ý: Import type Navigation để chuyển hướng sang trang Đăng ký
export default function LoginScreen({ navigation }: any) {
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Xử lý Đăng nhập Email
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }
    setIsLoading(true);
    try {
      await loginWithEmail(email, password);
      // Đăng nhập thành công, Firebase onAuthStateChanged ở AppNavigator sẽ tự động chuyển màn hình
    } catch (error: any) {
      Alert.alert('Đăng nhập thất bại', error.message || 'Sai tài khoản hoặc mật khẩu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý Đăng nhập Khách
  const handleGuestLogin = async () => {
    setIsLoading(true);
    try {
      await loginAsGuest();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng nhập dưới dạng khách.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <View style={styles.content}>
          
          {/* Tiêu đề */}
          <View style={styles.headerContainer}>
            <Text style={[styles.title, { color: colors.text }]}>Health Monitor</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Đăng nhập để theo dõi sức khỏe của bạn
            </Text>
          </View>

          {/* Form nhập liệu */}
          <View style={styles.formContainer}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
              placeholder="Nhập email của bạn"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={[styles.label, { color: colors.textSecondary }]}>Mật khẩu</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.input, color: colors.text, borderColor: colors.border }]}
              placeholder="Nhập mật khẩu"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Nút Đăng nhập Email */}
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: colors.primary }]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textMuted }]}>HOẶC</Text>
              <View style={[styles.line, { backgroundColor: colors.border }]} />
            </View>

            {/* Nút Đăng nhập Khách */}
            <TouchableOpacity 
              style={[styles.guestButton, { borderColor: colors.border, backgroundColor: colors.card }]} 
              onPress={handleGuestLogin}
              disabled={isLoading}
            >
              <Text style={[styles.guestButtonText, { color: colors.text }]}>Sử dụng tài khoản Khách</Text>
            </TouchableOpacity>

            {/* Nút Google / Apple có thể thêm ở đây sau */}
          </View>

          {/* Chuyển sang trang Đăng ký */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.textSecondary }]}>Chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')} disabled={isLoading}>
              <Text style={[styles.registerLink, { color: colors.primary }]}>Đăng ký ngay</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, justifyContent: 'center' },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  headerContainer: { marginBottom: 32, alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center' },
  formContainer: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { height: 52, borderWidth: 1, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, marginBottom: 16 },
  primaryButton: { height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  line: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 16, fontSize: 12, fontWeight: '600' },
  guestButton: { height: 52, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  guestButtonText: { fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  footerText: { fontSize: 14 },
  registerLink: { fontSize: 14, fontWeight: '700' },
});