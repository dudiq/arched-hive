import { describe, expect, it } from '@repo/unit-test'

import { AnalyticStore } from './analytic.store'

describe('AnalyticStore', () => {
  const createStore = () => {
    const store = new AnalyticStore()

    store.lists.setResult({
      data: {
        expenseList: [
          {
            id: '1',
            catId: 'food',
            cost: 100,
            time: Date.now(),
            pouchId: 'p1',
            state: 0,
          },
          {
            id: '2',
            catId: 'food-grocery',
            cost: 50,
            time: Date.now(),
            pouchId: 'p1',
            state: 0,
          },
          {
            id: '3',
            catId: 'transport',
            cost: 200,
            time: Date.now(),
            pouchId: 'p1',
            state: 0,
          },
        ],
        categoryList: [
          { id: 'food', title: 'Food', catId: undefined },
          { id: 'food-grocery', title: 'Grocery', catId: 'food' },
          { id: 'transport', title: 'Transport', catId: undefined },
        ],
      },
    })

    return store
  }

  describe('categoryReportViewMap', () => {
    it('should group expenses by category hierarchy', () => {
      const store = createStore()
      const result = store.categoryReportViewMap

      // First, let's debug the actual structure
      console.log(JSON.stringify(result, null, 2))

      // Then verify specific properties instead of exact match
      expect(result).toBeDefined()
      expect(result.food).toBeDefined()
      expect(result.food.node.id).toBe('food')
      expect(result.food.node.title).toBe('Food')
      expect(result.food.node.cost).toBe(150)
      expect(result.food.children['food-grocery']).toBeDefined()
      expect(result.food.children['food-grocery'].cost).toBe(50)
    })

    it('should calculate total costs for parent categories', () => {
      const store = createStore()
      const result = store.categoryReportViewMap

      expect(result.food.node.cost).toBe(150)
    })

    it('should handle categories without expenses', () => {
      const store = createStore()
      store.lists.setResult({
        data: {
          expenseList: store.lists.data!.expenseList,
          categoryList: [
            ...store.lists.data!.categoryList,
            { id: 'empty-cat', title: 'Empty', catId: undefined },
          ],
        },
      })

      const result = store.categoryReportViewMap

      expect(result['empty-cat']).toBeUndefined()
    })
  })

  describe('totalCost', () => {
    it('should calculate total cost of all expenses', () => {
      const store = createStore()
      expect(store.totalCost).toBe(350) // 100 + 50 + 200
    })

    it('should return 0 for empty expense list', () => {
      const store = createStore()
      store.lists.setResult({
        data: { expenseList: [], categoryList: [] },
      })
      expect(store.totalCost).toBe(0)
    })
  })

  describe('categorySelection', () => {
    it('should filter expenses by selected category', () => {
      const store = createStore()
      store.setSelectedCategory('food')

      const result = store.expenseListView
      expect(result.length).toBe(2)
      expect(
        result.every(
          (expense) =>
            expense.catId === 'food' || expense.catId === 'food-grocery',
        ),
      ).toBe(true)
    })

    it('should include child category expenses when parent selected', () => {
      const store = createStore()
      store.setSelectedCategory('food')

      const result = store.categoryReportViewMap
      expect(result.food.node.cost).toBe(150)
      expect(Object.keys(result).length).toBe(1)
    })

    it('should show all categories when no selection', () => {
      const store = createStore()
      const result = store.categoryReportViewMap

      expect(Object.keys(result)).toHaveLength(2) // food and transport
      expect(result.transport.node.cost).toBe(200)
      expect(result.food.node.cost).toBe(150)
    })
  })

  describe('expenseListView', () => {
    it('should filter expenses based on category selection', () => {
      const store = createStore()
      store.setSelectedCategory('transport')

      const result = store.expenseListView
      expect(result).toHaveLength(1)
      expect(result[0].catId).toBe('transport')
    })

    it('should return all expenses when no category selected', () => {
      const store = createStore()
      const result = store.expenseListView
      expect(result).toHaveLength(3)
    })
  })
})
