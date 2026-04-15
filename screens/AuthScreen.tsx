import { useState } from 'react'
import { View, TextInput, Button, Alert, Text } from 'react-native'
import { supabase } from '../lib/supabase'

export default function AuthScreen() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  // Sign up — Supabase creates auth.users row,
  // then our trigger creates public.users row automatically
  async function signUp() {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: 'My Name' } } // passed to our trigger
    })
    if (error) Alert.alert('Error', error.message)
    else Alert.alert('Check your email for a confirmation link!')
    setLoading(false)
  }

  // Sign in — returns a session with access_token (JWT)
  async function signIn() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) Alert.alert('Error', error.message)
    setLoading(false)
  }

  return (
    <View style={{ padding: 24, gap: 12 }}>
      <TextInput placeholder="Email"    value={email}    onChangeText={setEmail}    autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title={loading ? "Loading..." : "Sign In"}  onPress={signIn}  disabled={loading} />
      <Button title={loading ? "Loading..." : "Sign Up"}  onPress={signUp}  disabled={loading} />
    </View>
  )
}
