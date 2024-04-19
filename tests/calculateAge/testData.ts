import { MSEC_PER_SEC } from "../../infrastructure/consts";

export const testData = [
	{
		params : new Date('2004-02-13'),
		tobe: 20
	},
	{
		params : new Date('2004-04-19'),
		tobe: 20
	},
	{
		params : new Date('2040-10-20'),
		tobe: 0
	},
	{
		params : new Date('2004-02-11'),
		tobe: 20
	},
	{
		params : new Date('2041-01-11'),
		tobe: 0
	},
	{
		params : new Date('2022-01-01'),
		tobe: 2
	},
	{
		params : new Date('2011-11-11'),
		tobe: 12
	},
	{
		params : new Date('1800-02-13'),
		tobe: 224
	},
	{
		params : new Date('2006-06-16'),
		tobe: 17
	},
	{
		params : new Date('2001-02-02'),
		tobe: 23
	},
	{
		params : new Date('2034-03-17'),
		tobe: 0
	},
	{
		params : new Date('2022-11-15'),
		tobe: 1
	},
	{
		params : new Date('1982-11-29'),
		tobe: 41
	},
	{
		params : new Date('2004-07-13'),
		tobe: 19
	},
]