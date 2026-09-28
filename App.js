import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';

// Mock data for hiking trails //

const TRAILS = [
  {
    id: '1',
    name: 'Cedar Ridge Loop',
    difficulty: 'Easy',
    distance: '2.4 mi',
    elevation: '180 ft',
    time: '1 hr',
    description:
      'A peaceful forest loop with gentle elevation changes and scenic views.',
  },
  {
    id: '2',
    name: 'Willow Creek Path',
    difficulty: 'Moderate',
    distance: '3.8 mi',
    elevation: '420 ft',
    time: '2 hrs',
    description:
      'A moderate trail following Willow Creek through wooded terrain.',
  },
  {
    id: '3',
    name: 'Sunset Bluff',
    difficulty: 'Hard',
    distance: '5.1 mi',
    elevation: '900 ft',
    time: '3 hrs',
    description:
      'A challenging climb leading to panoramic views from Sunset Bluff.',
  },
  {
    id: '4',
    name: 'Granite Peak Summit Trail',
    difficulty: 'Hard',
    distance: '5.6 mi',
    elevation: '1,420 ft',
    time: '3.5 hrs',
    description:
      'A challenging out-and-back hike with steady elevation gain and rewarding panoramic views from the summit.',
  },
];

// ======================================================
// TRAIL CARD COMPONENT
// ======================================================

function TrailCard({
  trail,
  isSaved,
  onToggleSave,
  onPress,
}) {
  return (
    <Pressable
      style={styles.trailCard}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`View details for ${trail.name}`}
    >

      {/* Trail image */}
      <View style={styles.trailImagePlaceholder}>
        <Text style={styles.trailImagePlaceholderText}>
          Trail Image
        </Text>
      </View>


      {/* Trail information */}
      <View style={styles.trailCopy}>

        {/* Trail name */}
        <Text
          style={styles.trailName}
          numberOfLines={1}
        >
          {trail.name}
        </Text>


        {/* Difficulty */}
        <View
          style={[
            styles.difficultyBadge,

            trail.difficulty === 'Easy' &&
              styles.easyBadge,

            trail.difficulty === 'Moderate' &&
              styles.moderateBadge,

            trail.difficulty === 'Hard' &&
              styles.hardBadge,
          ]}
        >
          <Text style={styles.difficultyText}>
            {trail.difficulty}
          </Text>
        </View>


        {/* Distance + elevation */}
        <Text style={styles.trailMeta}>
          {trail.distance} · {trail.elevation}
        </Text>

      </View>


      {/* Save / Unsave Star */}
      <Pressable
        style={styles.saveButton}
        onPress={(event) => {
          event.stopPropagation();
          onToggleSave();
        }}
        accessibilityRole="button"
        accessibilityLabel={
          isSaved
            ? `Unsave ${trail.name}`
            : `Save ${trail.name}`
        }
        accessibilityState={{
          selected: isSaved,
        }}
      >

        <Text
          style={[
            styles.starIcon,
            isSaved && styles.savedStar,
          ]}
        >
          {isSaved ? '★' : '☆'}
        </Text>

      </Pressable>

    </Pressable>
  );
}
export default function App() {

    // Which main screen is currently displayed?
  const [currentScreen, setCurrentScreen] = useState('explore');

  // Which trail did the user select?
  const [selectedTrail, setSelectedTrail] = useState(null);

  // What has the user typed into the search box?
  const [searchText, setSearchText] = useState('');

  // Which difficulty filter is selected?
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  // Which trails has the user saved?
  const [savedTrails, setSavedTrails] = useState([]);

  // ======================================================
// SAVE / UNSAVE TRAILS
// ======================================================

const toggleSaveTrail = (trailId) => {

  const isAlreadySaved = savedTrails.includes(trailId);

  if (isAlreadySaved) {

    // Remove the trail from saved trails
    setSavedTrails(
      savedTrails.filter((id) => id !== trailId)
    );

  } else {

    // Add the trail to saved trails
    setSavedTrails([
      ...savedTrails,
      trailId,
    ]);

  }
};

  const filteredTrails = TRAILS.filter((trail) => {
  const matchesSearch = trail.name
    .toLowerCase()
    .includes(searchText.toLowerCase());

  const matchesDifficulty =
    difficultyFilter === 'All' ||
    trail.difficulty === difficultyFilter;

  return matchesSearch && matchesDifficulty;
});

return (
  <SafeAreaView style={styles.container}>

    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >

      {/* APP NAME */}
      <Text style={styles.brand}>
        TrailMate
      </Text>


      {/* SEARCH BAR */}
      <View style={styles.searchField}>

        <Text
          style={styles.searchIcon}
          accessibilityElementsHidden={true}
        >
          ⌕
        </Text>

        <TextInput
          style={styles.searchInput}
          placeholder="Search trails"
          placeholderTextColor="#626879"
          value={searchText}
          onChangeText={setSearchText}
          accessibilityLabel="Search trails"
        />

      </View>


      {/* DIFFICULTY FILTERS */}
      <View style={styles.filters}>

        {['All', 'Easy', 'Moderate', 'Hard'].map((difficulty) => {

          const isActive = difficultyFilter === difficulty;

          return (
            <Pressable
              key={difficulty}
              style={[
                styles.filterButton,
                isActive && styles.activeFilter,
              ]}
              onPress={() => setDifficultyFilter(difficulty)}
              accessibilityRole="button"
              accessibilityLabel={`Filter trails by ${difficulty}`}
              accessibilityState={{ selected: isActive }}
            >

              <Text
                style={[
                  styles.filterText,
                  isActive && styles.activeFilterText,
                ]}
              >
                {difficulty}
              </Text>

            </Pressable>
          );
        })}

      </View>


{/* TRAIL LIST */}
<View style={styles.trailList}>

  {filteredTrails.map((trail) => (

    <TrailCard
      key={trail.id}

      trail={trail}

      isSaved={
        savedTrails.includes(trail.id)
      }

      onToggleSave={() =>
        toggleSaveTrail(trail.id)
      }

      onPress={() => {
        setSelectedTrail(trail);
        setCurrentScreen('details');
      }}
    />

  ))}

</View>


      {/* EMPTY SEARCH RESULT */}
      {filteredTrails.length === 0 && (

        <Text style={styles.emptyState}>
          No trails found.
        </Text>

      )}

    </ScrollView>

    <StatusBar style="dark" />

  </SafeAreaView>
);
}

const styles = StyleSheet.create({

  // ======================================================
  // SCREEN
  // ======================================================

  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 40,
  },


  // ======================================================
  // TRAILMATE TITLE
  // ======================================================

  brand: {
    color: '#317451',
    fontSize: 38,
    fontWeight: '800',
    marginBottom: 30,
  },


  // ======================================================
  // SEARCH
  // ======================================================

  searchField: {
    height: 60,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 20,

    borderWidth: 2,
    borderColor: '#d8dbe2',
    borderRadius: 30,

    backgroundColor: '#ffffff',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.09,
    shadowRadius: 4,

    elevation: 3,
  },

  searchIcon: {
    color: '#626879',
    fontSize: 28,
    marginRight: 12,
  },

  searchInput: {
    flex: 1,
    color: '#202432',
    fontSize: 20,
  },


  // ======================================================
  // FILTERS
  // ======================================================

  filters: {
    flexDirection: 'row',
    gap: 8,

    marginTop: 25,
    marginBottom: 26,
  },

  filterButton: {
    flex: 1,
    height: 48,

    alignItems: 'center',
    justifyContent: 'center',

    borderWidth: 2,
    borderColor: '#d8dbe2',
    borderRadius: 16,

    backgroundColor: '#ffffff',
  },

  activeFilter: {
    borderColor: '#317451',
    backgroundColor: '#317451',
  },

  filterText: {
    color: '#626879',
    fontSize: 16,
    fontWeight: '600',
  },

  activeFilterText: {
    color: '#ffffff',
  },


  // ======================================================
  // TRAIL LIST
  // ======================================================

  trailList: {
    gap: 14,
  },

  trailCard: {
    minHeight: 152,

    flexDirection: 'row',
    alignItems: 'center',

    gap: 12,
    padding: 12,

    borderWidth: 2,
    borderColor: '#d8dbe2',
    borderRadius: 16,

    backgroundColor: '#ffffff',

    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 2,
},

trailImagePlaceholder: {
  width: 110,
  height: 126,

  alignItems: 'center',
  justifyContent: 'center',

  borderRadius: 10,

  backgroundColor: '#e4e7e8',
},

trailImagePlaceholderText: {
  color: '#626879',
  fontSize: 12,
},

trailCopy: {
  flex: 1,
  minWidth: 0,

  alignItems: 'flex-start',
  justifyContent: 'center',
},

trailName: {
  maxWidth: '100%',
  color: '#202432',
  fontSize: 20,
  lineHeight: 24,
  fontWeight: '700',
},

  // ======================================================
  // DIFFICULTY BADGES
  // ======================================================

  difficultyBadge: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 12,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
  },

  easyBadge: {
    backgroundColor: '#4e9668',
  },

  moderateBadge: {
    backgroundColor: '#f3b52f',
  },

  hardBadge: {
    backgroundColor: '#626879',
  },

  difficultyText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },


  // ======================================================
  // TRAIL INFORMATION
  // ======================================================

  trailMeta: {
    color: '#626879',
    fontSize: 15,
  },

  saveButton: {
    width: 50,
    height: 50,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    backgroundColor: '#f1f2f4',
},

  starIcon: {
    color: '#626879',
    fontSize: 32,
    fontWeight: '600',
},

  savedStar: {
    color: '#f3b52f',
  },

  // ======================================================
  // EMPTY SEARCH
  // ======================================================

  emptyState: {
    paddingVertical: 40,

    color: '#626879',
    fontSize: 18,

    textAlign: 'center',
  },

});
