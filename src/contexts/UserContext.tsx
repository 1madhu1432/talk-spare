import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface UserContextType {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  generateRandomProfile: () => UserProfile;
}

const getRandomNickname = () => {
  const adjectives = ['Global', 'Swift', 'Curious', 'Fluent', 'Cosmic', 'Bright', 'Active', 'Vibrant', 'Calm', 'Eager'];
  const nouns = ['Speaker', 'Learner', 'Talker', 'Linguist', 'Polyglot', 'Explorer', 'Friend', 'Voice', 'Echo', 'Wanderer'];
  const num = Math.floor(100 + Math.random() * 900);
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj}${noun}${num}`;
};

const defaultProfile: UserProfile = {
  nickname: getRandomNickname(),
  language: 'English',
  level: 'Intermediate',
  goal: 'Casual Talk',
  avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    // Session memory only
    const stored = sessionStorage.getItem('talksphere_temp_profile');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        // Fallback
      }
    }
    return defaultProfile;
  });

  useEffect(() => {
    sessionStorage.setItem('talksphere_temp_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const generateRandomProfile = () => {
    const newNickname = getRandomNickname();
    const newAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`;
    const newProfile = { ...profile, nickname: newNickname, avatar: newAvatar };
    setProfile(newProfile);
    return newProfile;
  };

  return (
    <UserContext.Provider value={{ profile, setProfile, updateProfile, generateRandomProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
