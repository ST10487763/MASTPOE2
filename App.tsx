import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Pressable, 
  ImageBackground, 
  TextInput,
  ScrollView,
  Alert,
  Animated,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Course = 'Starter' | 'Main' | 'Dessert' | 'Drink';
type Screen = 'home' | 'add' | 'view';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  course: Course;
  price: string;
}

export default function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course>('Main');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [filterCourse, setFilterCourse] = useState<Course | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const courses: Course[] = ['Starter', 'Main', 'Dessert', 'Drink'];

  // Calculate average price
  const getNumericPrice = (priceString: string): number => {
    return parseFloat(priceString.replace('R ', ''));
  };

  const totalAmount = menuItems.reduce((total, item) => {
    return total + getNumericPrice(item.price);
  }, 0);

  const averagePrice = menuItems.length > 0 
    ? totalAmount / menuItems.length 
    : 0;

  // Calculate average price by course
  const getAveragePriceByCourse = (course: Course) => {
    const courseItems = menuItems.filter(item => item.course === course);
    if (courseItems.length === 0) return 0;
    
    const courseTotal = courseItems.reduce((total, item) => {
      return total + getNumericPrice(item.price);
    }, 0);
    
    return courseTotal / courseItems.length;
  };

  // Filter and search functionality
  const filteredItems = menuItems.filter(item => {
    const matchesCourse = filterCourse === 'All' || item.course === filterCourse;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  const handleAddMenuItem = () => {
    if (!name.trim() || !description.trim() || !price.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    const newItem: MenuItem = {
      id: Math.random().toString(36).substring(7),
      name: name.trim(),
      description: description.trim(),
      course: selectedCourse,
      price: `R ${parseFloat(price).toFixed(2)}`
    };

    setMenuItems([...menuItems, newItem]);
    
    // Reset form
    setName('');
    setDescription('');
    setPrice('');
    setSelectedCourse('Main');

    // Animation
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Alert.alert('Success', 'Menu item added successfully!');
  };

  const handleDeleteMenuItem = (id: string, itemName: string) => {
    Alert.alert(
      'Delete Menu Item',
      `Are you sure you want to delete "${itemName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            setMenuItems(menuItems.filter(item => item.id !== id));
            Alert.alert('Success', 'Menu item deleted successfully!');
          }
        }
      ]
    );
  };

  const getCourseColor = (course: Course) => {
    switch (course) {
      case 'Starter': return '#ea2222ff';
      case 'Main': return '#cd4e7dff';
      case 'Dessert': return '#FFD166';
      case 'Drink': return '#6A0572';
      default: return '#6cf2caff';
    }
  };

  // Logo Component
  const Logo = () => (
    <View style={styles.logoContainer}>
      <Image 
        source={require('./assets/applogo.png')} 
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );

  // Header with Logo and Title Component
  const HeaderWithLogo = ({ title, subtitle }: { title: string; subtitle: string }) => (
    <View style={styles.headerWithLogo}>
      <Logo />
      <View style={styles.headerTextContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );

  // Home Screen Component
  const HomeScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <HeaderWithLogo 
        title="Chef Menu App "
        subtitle="Welcome to your digital menu management system"
      />
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{menuItems.length}</Text>
          <Text style={styles.statLabel}>Total Menu Items</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {menuItems.filter(item => item.course === 'Starter').length}
          </Text>
          <Text style={styles.statLabel}>Starters</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {menuItems.filter(item => item.course === 'Main').length}
          </Text>
          <Text style={styles.statLabel}>Main Courses</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {menuItems.filter(item => item.course === 'Dessert').length}
          </Text>
          <Text style={styles.statLabel}>Desserts</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {menuItems.filter(item => item.course === 'Drink').length}
          </Text>
          <Text style={styles.statLabel}>Drinks</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>R {averagePrice.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Avg Price</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>R {totalAmount.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Value</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <Pressable 
          style={[styles.actionButton, styles.primaryButton]} 
          onPress={() => setCurrentScreen('add')}
        >
          <Text style={styles.actionButtonText}>Add New Dish</Text>
        </Pressable>
        
        <Pressable 
          style={[styles.actionButton, styles.secondaryButton]} 
          onPress={() => setCurrentScreen('view')}
        >
          <Text style={styles.actionButtonText}>View Full Menu</Text>
        </Pressable>
      </View>

      <View style={styles.recentItems}>
        <Text style={styles.recentTitle}>Recently Added Dishes</Text>
        {menuItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No dishes added yet. Start building your menu by adding your first dish!
            </Text>
            <Pressable 
              style={[styles.button, styles.smallButton]} 
              onPress={() => setCurrentScreen('add')}
            >
              <Text style={styles.buttonText}>Add Your First Dish</Text>
            </Pressable>
          </View>
        ) : (
          menuItems.slice(-3).reverse().map((item) => (
            <Animated.View 
              key={item.id}
              style={[
                styles.menuItem,
                { opacity: fadeAnim }
              ]}
            >
              <View style={styles.menuItemHeader}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <View style={[
                  styles.courseBadge,
                  { backgroundColor: getCourseColor(item.course) }
                ]}>
                  <Text style={styles.courseBadgeText}>{item.course}</Text>
                </View>
              </View>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
              <Text style={styles.menuItemPrice}>{item.price}</Text>
            </Animated.View>
          ))
        )}
      </View>
    </ScrollView>
  );

  // Add Screen Component
  const AddScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <HeaderWithLogo 
        title="Add New Dish"
        subtitle="Create a new menu item for your restaurant"
      />
      
      <View style={styles.formContainer}>
        <Text style={styles.label}>Dish Name:</Text>
        <TextInput
          style={styles.textInput}
          value={name}
          onChangeText={setName}
          placeholder="Enter the dishes name"
          placeholderTextColor="#888"
        />

        <Text style={styles.label}>Description:</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description of the dish"
          placeholderTextColor="#888"
          multiline
          numberOfLines={3}
        />

        <Text style={styles.label}>Select Course:</Text>
        <View style={styles.courseContainer}>
          {courses.map((course) => (
            <Pressable
              key={course}
              style={[
                styles.courseButton,
                selectedCourse === course && {
                  backgroundColor: getCourseColor(course),
                  borderColor: getCourseColor(course)
                }
              ]}
              onPress={() => setSelectedCourse(course)}
            >
              <Text style={[
                styles.courseButtonText,
                selectedCourse === course && styles.courseButtonTextSelected
              ]}>
                {course}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Price (Rands):</Text>
        <TextInput
          style={styles.textInput}
          value={price}
          onChangeText={setPrice}
          placeholder="Enter price in Rands"
          placeholderTextColor="#888"
          keyboardType="decimal-pad"
        />
      </View>
      
      <Pressable style={styles.button} onPress={handleAddMenuItem}>
        <Text style={styles.buttonText}>Add Dish</Text>
      </Pressable>
      
      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total Items: {menuItems.length} | Avg Price: R {averagePrice.toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );

  // View Screen Component
  const ViewScreen = () => (
    <ScrollView showsVerticalScrollIndicator={false}>
      <HeaderWithLogo 
        title="Menu Items "
        subtitle={`${menuItems.length} dishes in your menu - Average Price: R ${averagePrice.toFixed(2)}`}
      />

      {/* Price Statistics */}
      <View style={styles.averagesContainer}>
        <View style={styles.averageCard}>
          <Text style={styles.averageLabel}>Total Menu Value</Text>
          <Text style={styles.averageValue}>R {totalAmount.toFixed(2)}</Text>
        </View>
        <View style={styles.averageCard}>
          <Text style={styles.averageLabel}>Average Price</Text>
          <Text style={styles.averageValue}>R {averagePrice.toFixed(2)}</Text>
        </View>
        <View style={styles.averageCard}>
          <Text style={styles.averageLabel}>Total Dishes</Text>
          <Text style={styles.averageValue}>{menuItems.length}</Text>
        </View>
      </View>

      {/* Course-wise Averages */}
      <View style={styles.courseAveragesContainer}>
        <Text style={styles.courseAveragesTitle}>Average Prices by Course</Text>
        <View style={styles.courseAverages}>
          {courses.map((course) => {
            const courseAverage = getAveragePriceByCourse(course);
            const courseCount = menuItems.filter(item => item.course === course).length;
            
            return (
              <View key={course} style={styles.courseAverageItem}>
                <View style={styles.courseAverageHeader}>
                  <View style={[
                    styles.courseDot,
                    { backgroundColor: getCourseColor(course) }
                  ]} />
                  <Text style={styles.courseName}>{course}</Text>
                </View>
                <View style={styles.courseAverageDetails}>
                  <Text style={styles.courseAveragePrice}>
                    R {courseAverage.toFixed(2)}
                  </Text>
                  <Text style={styles.courseCount}>({courseCount} items)</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search dishes by name or description..."
          placeholderTextColor="#888"
        />
        
        <Text style={styles.label}>Filter by Course:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <View style={styles.filterButtons}>
            {(['All', ...courses] as const).map((course) => (
              <Pressable
                key={course}
                style={[
                  styles.filterButton,
                  filterCourse === course && {
                    backgroundColor: course === 'All' ? '#6cf2caff' : getCourseColor(course),
                    borderColor: course === 'All' ? '#6cf2caff' : getCourseColor(course)
                  }
                ]}
                onPress={() => setFilterCourse(course)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filterCourse === course && styles.filterButtonTextSelected
                ]}>
                  {course}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Menu Items List */}
      <View style={styles.menuListContainer}>
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              {menuItems.length === 0 
                ? 'No dishes added yet. Switch to the "Add Dish" tab to create your first menu item!' 
                : 'No dishes match your search criteria.'
              }
            </Text>
            {menuItems.length === 0 && (
              <Pressable 
                style={[styles.button, styles.smallButton]} 
                onPress={() => setCurrentScreen('add')}
              >
                <Text style={styles.buttonText}>Add Your First Dish</Text>
              </Pressable>
            )}
          </View>
        ) : (
          filteredItems.map((item) => (
            <View key={item.id} style={styles.menuItemCard}>
              <View style={styles.menuItemHeader}>
                <Text style={styles.menuItemName}>{item.name}</Text>
                <View style={[
                  styles.courseBadge,
                  { backgroundColor: getCourseColor(item.course) }
                ]}>
                  <Text style={styles.courseBadgeText}>{item.course}</Text>
                </View>
              </View>
              <Text style={styles.menuItemDescription}>{item.description}</Text>
              <View style={styles.menuItemFooter}>
                <Text style={styles.menuItemPrice}>{item.price}</Text>
                <Pressable 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteMenuItem(item.id, item.name)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  return (
    <ImageBackground 
      source={require("./assets/appbackground.jpeg")} 
      style={styles.background}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          {/* Navigation Tabs */}
          <View style={styles.tabContainer}>
            <Pressable 
              style={[
                styles.tab, 
                currentScreen === 'home' && styles.activeTab
              ]}
              onPress={() => setCurrentScreen('home')}
            >
              <Text style={[
                styles.tabText,
                currentScreen === 'home' && styles.activeTabText
              ]}>
                Home
              </Text>
            </Pressable>
            <Pressable 
              style={[
                styles.tab, 
                currentScreen === 'add' && styles.activeTab
              ]}
              onPress={() => setCurrentScreen('add')}
            >
              <Text style={[
                styles.tabText,
                currentScreen === 'add' && styles.activeTabText
              ]}>
                Add Dish
              </Text>
            </Pressable>
            <Pressable 
              style={[
                styles.tab, 
                currentScreen === 'view' && styles.activeTab
              ]}
              onPress={() => setCurrentScreen('view')}
            >
              <Text style={[
                styles.tabText,
                currentScreen === 'view' && styles.activeTabText
              ]}>
                View Menu ({menuItems.length})
              </Text>
            </Pressable>
          </View>

          {/* Screen Content */}
          {currentScreen === 'home' && <HomeScreen />}
          {currentScreen === 'add' && <AddScreen />}
          {currentScreen === 'view' && <ViewScreen />}
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1, 
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 16
  },
  safeArea: {
    flex: 1, 
    justifyContent: "flex-start"
  },
  // Header with Logo Styles
  headerWithLogo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    gap: 15,
  },
  headerTextContainer: {
    flex: 1,
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 5,
    borderWidth: 2,
    borderColor: '#f22da3ff',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#f22da3ff",
    textAlign: 'left'
  },
  subtitle: {
    color: "pink", 
    fontSize: 14,
    textAlign: 'left'
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FF6F61',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  // Home Screen Styles
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 10
  },
  statCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    minWidth: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F61',
    marginBottom: 5
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  actionButtons: {
    marginBottom: 20,
    gap: 10
  },
  actionButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: "#FF6F61",
  },
  secondaryButton: {
    backgroundColor: "#6cf2caff",
  },
  actionButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16
  },
  // Form Styles
  formContainer: {
    backgroundColor: "rgba(238, 171, 206, 0.9)",
    borderRadius: 10,
    padding: 18, 
    marginBottom: 18,
  },
  label: {
    color: "#9411d6ff", 
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 16
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  courseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    gap: 8
  },
  courseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: 'transparent'
  },
  courseButtonText: {
    color: '#666',
    fontWeight: '500'
  },
  courseButtonTextSelected: {
    color: 'white',
    fontWeight: '600'
  },
  courseBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  courseBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  button: {
    backgroundColor: "#FF6F61", 
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 18
  },
  smallButton: {
    paddingVertical: 8,
    marginTop: 10,
  },
  buttonText: {
    textAlign: "center", 
    color: "white",
    fontWeight: "700",
    fontSize: 16
  },
  summary: {
    alignItems: "center",
    marginBottom: 12
  },
  summaryText: {
    color: "#11e6b8", 
    fontSize: 18,
    fontWeight: '600'
  },
  recentItems: {
    backgroundColor: "rgba(255,255,255,0.9)", 
    padding: 16,
    borderRadius: 8,
    minHeight: 100
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#074734',
    marginBottom: 12,
    textAlign: 'center'
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20
  },
  menuItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#074734',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#074734',
    flex: 1
  },
  menuItemDescription: {
    color: '#666',
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6F61',
  },
  // View Screen Styles
  averagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    gap: 10,
  },
  averageCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  averageLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  averageValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6F61',
    textAlign: 'center',
  },
  courseAveragesContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 16,
    marginBottom: 18,
  },
  courseAveragesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#074734',
    marginBottom: 12,
    textAlign: 'center',
  },
  courseAverages: {
    gap: 8,
  },
  courseAverageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  courseAverageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  courseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  courseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#074734',
  },
  courseAverageDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  courseAveragePrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF6F61',
  },
  courseCount: {
    fontSize: 12,
    color: '#666',
  },
  filterContainer: {
    backgroundColor: "rgba(238, 171, 206, 0.9)",
    borderRadius: 10,
    padding: 18,
    marginBottom: 18,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333'
  },
  filterScroll: {
    marginHorizontal: -5,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    backgroundColor: 'transparent'
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '500'
  },
  filterButtonTextSelected: {
    color: 'white',
    fontWeight: '600'
  },
  menuListContainer: {
    backgroundColor: "rgba(255,255,255,0.9)", 
    padding: 10,
    borderRadius: 8,
    minHeight: 200,
  },
  menuItemCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#074734',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButton: {
    backgroundColor: '#ff4757',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 10,
  },
});