describe('Jasmine Sanity', () => {
	xit('should return an error', () => {
		expect(1 + 1).toBe(3)
	})

	it('should NOT return an error', () => {
		expect(5).toBeGreaterThan(4)
	})
})
