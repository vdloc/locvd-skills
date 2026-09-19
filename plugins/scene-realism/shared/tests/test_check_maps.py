import os
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import check_maps  # noqa: E402


class ChannelStatsTests(unittest.TestCase):
    def test_basic_stats(self):
        stats = check_maps.channel_stats([0.2, 0.4, 0.6])
        self.assertAlmostEqual(stats.mean, 0.4)
        self.assertEqual(stats.minimum, 0.2)
        self.assertEqual(stats.maximum, 0.6)

    def test_empty_list_raises(self):
        with self.assertRaises(ValueError):
            check_maps.channel_stats([])


class MetalnessTests(unittest.TestCase):
    def test_near_zero_is_plausible(self):
        self.assertTrue(check_maps.metalness_is_plausible([0.0, 0.02, 0.01]))

    def test_near_one_is_plausible(self):
        self.assertTrue(check_maps.metalness_is_plausible([0.98, 1.0, 0.97]))

    def test_mid_grey_is_not_plausible(self):
        self.assertFalse(check_maps.metalness_is_plausible([0.4, 0.5, 0.6]))


class AlbedoTests(unittest.TestCase):
    def test_in_range_is_plausible(self):
        self.assertTrue(check_maps.albedo_is_plausible((0.2, 0.25, 0.3)))

    def test_near_black_is_not_plausible(self):
        self.assertFalse(check_maps.albedo_is_plausible((0.01, 0.01, 0.01)))

    def test_near_white_is_not_plausible(self):
        self.assertFalse(check_maps.albedo_is_plausible((0.95, 0.95, 0.95)))


class SrgbToLinearTests(unittest.TestCase):
    def test_endpoints_are_fixed(self):
        self.assertEqual(check_maps.srgb_to_linear(0.0), 0.0)
        self.assertAlmostEqual(check_maps.srgb_to_linear(1.0), 1.0)

    def test_mid_grey_matches_the_srgb_curve(self):
        # sRGB 0.5 encodes linear ~0.2140 (IEC 61966-2-1)
        self.assertAlmostEqual(check_maps.srgb_to_linear(0.5), 0.2140, places=3)

    def test_toe_segment_is_linear(self):
        self.assertAlmostEqual(check_maps.srgb_to_linear(0.04), 0.04 / 12.92)

    def test_albedo_means_are_taken_in_linear_light(self):
        # an sRGB 0.5 grey is linear 0.214: a plausible albedo whose
        # *encoded* value (0.5) would look brighter than it is
        means = check_maps.linear_albedo_means([(0.5, 0.5, 0.5)] * 4)
        for channel in means:
            self.assertAlmostEqual(channel, 0.2140, places=3)

    def test_encoded_value_that_looks_ok_is_too_dark_in_linear_light(self):
        # sRGB 0.15 passes a naive 0.03..0.90 check but is linear ~0.020
        encoded = (0.15, 0.15, 0.15)
        self.assertTrue(check_maps.albedo_is_plausible(encoded))
        linear = check_maps.linear_albedo_means([encoded])
        self.assertFalse(check_maps.albedo_is_plausible(linear))

    def test_empty_samples_raise(self):
        with self.assertRaises(ValueError):
            check_maps.linear_albedo_means([])


class NormalMapConventionTests(unittest.TestCase):
    def test_typical_flat_normal_map_passes(self):
        self.assertTrue(check_maps.normal_map_is_gl_convention(0.5, 0.98))

    def test_swapped_channels_fails(self):
        self.assertFalse(check_maps.normal_map_is_gl_convention(0.98, 0.5))


class LoadRgbPixelsTests(unittest.TestCase):
    def test_reads_a_real_image_with_pillow(self):
        from PIL import Image

        with tempfile.TemporaryDirectory() as tmp:
            path = os.path.join(tmp, "solid.png")
            Image.new("RGB", (10, 10), color=(51, 102, 153)).save(path)

            pixels = check_maps.load_rgb_pixels(path, sample_stride=1)

            self.assertEqual(len(pixels), 100)
            r, g, b = pixels[0]
            self.assertAlmostEqual(r, 51 / 255, places=3)
            self.assertAlmostEqual(g, 102 / 255, places=3)
            self.assertAlmostEqual(b, 153 / 255, places=3)


if __name__ == "__main__":
    unittest.main()
